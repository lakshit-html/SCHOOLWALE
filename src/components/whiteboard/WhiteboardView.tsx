import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool,
  Pencil,
  Highlighter,
  Eraser,
  Minus,
  Circle,
  Square,
  ArrowRight,
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  Trash2,
  Maximize2,
  Minimize2,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  BookOpen,
  Loader2
} from 'lucide-react';
import { compressImageForMobile } from '../../services/blobStorage';
import { useApp } from '../../context/AppContext';
import { isModifierPressed } from '../../utils/platform';
import { loadPdfDocument, renderPdfPageToImage } from '../../services/pdfRenderer';

type ToolType =
  | 'pen'
  | 'pencil'
  | 'marker'
  | 'eraser'
  | 'ruler'
  | 'compass'
  | 'arrow'
  | 'rectangle';

type BoardTheme = 'pw-dark' | 'ruled' | 'grid' | 'white' | 'pure-black';

const COLOR_PALETTE = [
  { name: 'Chalk White', hex: '#f8fafc' },
  { name: 'PW Neon Yellow', hex: '#facc15' },
  { name: 'Cyan Blue', hex: '#38bdf8' },
  { name: 'Laser Green', hex: '#4ade80' },
  { name: 'Hot Coral', hex: '#f87171' },
  { name: 'Vivid Orange', hex: '#fb923c' },
  { name: 'Electric Purple', hex: '#c084fc' },
  { name: 'Highlighter Glow', hex: '#fef08a' }
];

export const WhiteboardView: React.FC = () => {
  const { whiteboardNote, setWhiteboardNote, showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [activeColor, setActiveColor] = useState<string>('#facc15'); // PW Yellow
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('pw-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [liveInfo, setLiveInfo] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Background PDF / Image
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [hasImage, setHasImage] = useState(false);

  // Multi-page PDF state
  const [pdfState, setPdfState] = useState<{
    doc: any;
    numPages: number;
    currentPage: number;
    fileName: string;
  } | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // Whiteboard sticky note state
  const [isNoteMinimized, setIsNoteMinimized] = useState(false);

  // Draw background helper
  const drawBoardBackground = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, theme: BoardTheme) => {
      ctx.save();
      if (theme === 'pw-dark') {
        // PhysicsWallah digital classroom board: Rich emerald slate
        ctx.fillStyle = '#0b1914';
        ctx.fillRect(0, 0, width, height);

        // Dot coordinate matrix
        ctx.fillStyle = '#164e3c44';
        const spacing = 32;
        for (let x = spacing; x < width; x += spacing) {
          for (let y = spacing; y < height; y += spacing) {
            ctx.beginPath();
            ctx.arc(x, y, 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (theme === 'grid') {
        // Engineering Graph Paper
        ctx.fillStyle = '#0c1427';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        const spacing = 25;
        for (let x = spacing; x < width; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = spacing; y < height; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (theme === 'ruled') {
        // Ruled School Notebook
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        const lineSpacing = 32;
        for (let y = 60; y < height; y += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        // Red vertical notebook margin line
        ctx.strokeStyle = '#f43f5e55';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(70, 0);
        ctx.lineTo(70, height);
        ctx.stroke();
      } else if (theme === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        const spacing = 28;
        for (let x = spacing; x < width; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = spacing; y < height; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else {
        // Pure OLED Black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    },
    []
  );

  const drawUploadedImage = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasW: number, canvasH: number) => {
      ctx.save();
      const hRatio = (canvasW * 0.9) / img.width;
      const vRatio = (canvasH * 0.9) / img.height;
      const ratio = Math.min(hRatio, vRatio, 1);
      const centerShiftX = (canvasW - img.width * ratio) / 2;
      const centerShiftY = (canvasH - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
      ctx.restore();
    },
    []
  );

  const saveHistoryState = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => {
        const next = prev.slice(0, historyStep + 1);
        next.push(data);
        if (next.length > 25) next.shift();
        return next;
      });
      setHistoryStep(prev => Math.min(prev + 1, 24));
    } catch {
      // Ignore in non-canvas environments
    }
  };

  // Re-render canvas on resize, theme change, or background change
  // Crucial fix: Do NOT stamp uninitialized or stale prevData on theme switch!
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(320, rect.width || window.innerWidth - 32);
    const height = Math.max(500, window.innerHeight - 240);

    canvas.width = width;
    canvas.height = height;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }

    if (ctx) {
      drawBoardBackground(ctx, width, height, boardTheme);
      if (backgroundImage) {
        drawUploadedImage(ctx, backgroundImage, width, height);
      }
      saveHistoryState(ctx);
    }
  }, [boardTheme, backgroundImage, drawBoardBackground, drawUploadedImage]);

  const handleUndo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextStep = historyStep - 1;
    if (history[nextStep]) {
      ctx.putImageData(history[nextStep], 0, 0);
      setHistoryStep(nextStep);
    }
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextStep = historyStep + 1;
    if (history[nextStep]) {
      ctx.putImageData(history[nextStep], 0, 0);
      setHistoryStep(nextStep);
    }
  };

  const handleClearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoardBackground(ctx, canvas.width, canvas.height, boardTheme);
    if (backgroundImage) {
      drawUploadedImage(ctx, backgroundImage, canvas.width, canvas.height);
    }
    saveHistoryState(ctx);
  };

  const handleRemoveImage = () => {
    setBackgroundImage(null);
    setHasImage(false);
    setPdfState(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBoardBackground(ctx, canvas.width, canvas.height, boardTheme);
    saveHistoryState(ctx);
  };

  // Unified Pointer & Touch coordinate resolver
  const getPointerCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const applyStrokeSettings = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'pencil') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.85;
    } else if (activeTool === 'marker') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = Math.max(20, strokeWidth * 3.5);
      ctx.globalAlpha = 0.35;
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = boardTheme === 'white' ? '#ffffff' : '#0b1914';
      ctx.lineWidth = Math.max(16, strokeWidth * 5);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 1.0;
    }
  };

  // Pointer event handlers (Work seamlessly on Desktop mouse, iPad Stylus, Android Touch!)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const coords = getPointerCoords(e);
    setIsDrawing(true);
    setStartPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    applyStrokeSettings(ctx);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    e.preventDefault();

    const coords = getPointerCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (['pen', 'pencil', 'marker', 'eraser'].includes(activeTool)) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'ruler') {
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      applyStrokeSettings(ctx);
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      const dx = coords.x - startPos.x;
      const dy = coords.y - startPos.y;
      const lengthPx = Math.round(Math.sqrt(dx * dx + dy * dy));
      const angleDeg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      setLiveInfo(`📏 Ruler: ${lengthPx}px (${(lengthPx / 37.8).toFixed(1)}cm) • ${angleDeg}°`);
    } else if (activeTool === 'compass') {
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      applyStrokeSettings(ctx);
      const dx = coords.x - startPos.x;
      const dy = coords.y - startPos.y;
      const radius = Math.round(Math.sqrt(dx * dx + dy * dy));

      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      setLiveInfo(`⭕ Compass: Radius = ${radius}px • Area: ${Math.round(Math.PI * radius * radius)}px²`);
    } else if (activeTool === 'arrow') {
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      applyStrokeSettings(ctx);
      drawArrow(ctx, startPos.x, startPos.y, coords.x, coords.y);
    } else if (activeTool === 'rectangle') {
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      applyStrokeSettings(ctx);
      ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDrawing(false);
    setStartPos(null);
    setLiveInfo(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.globalAlpha = 1.0;
      saveHistoryState(ctx);
    }
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) => {
    const headLength = 16;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(toX, toY);
    ctx.fillStyle = activeColor;
    ctx.fill();
  };

  // Handle PDF Page flipping
  const handlePdfPageChange = async (targetPage: number) => {
    if (!pdfState || targetPage < 1 || targetPage > pdfState.numPages || isPdfLoading) return;
    try {
      setIsPdfLoading(true);
      const canvas = canvasRef.current;
      const targetW = canvas ? canvas.width : 1600;
      const img = await renderPdfPageToImage(pdfState.doc, targetPage, targetW);
      setPdfState(prev => (prev ? { ...prev, currentPage: targetPage } : null));
      setBackgroundImage(img);
      setHasImage(true);
    } catch (err) {
      console.error('PDF page switch error:', err);
      showToast?.(`Could not load page ${targetPage}`, 'error');
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Upload Slide / Question Image or PDF
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      try {
        setIsPdfLoading(true);
        const loaded = await loadPdfDocument(file);
        const canvas = canvasRef.current;
        const targetW = canvas ? canvas.width : 1600;
        const img = await renderPdfPageToImage(loaded.pdfDoc, 1, targetW);

        setPdfState({
          doc: loaded.pdfDoc,
          numPages: loaded.numPages,
          currentPage: 1,
          fileName: loaded.fileName
        });
        setBackgroundImage(img);
        setHasImage(true);
        showToast?.(`Opened PDF: ${loaded.fileName} (${loaded.numPages} pages)`, 'success');
      } catch (err) {
        console.error('PDF upload error:', err);
        alert('Could not open PDF. Please make sure the file is valid and unencrypted.');
      } finally {
        setIsPdfLoading(false);
      }
    } else {
      try {
        const dataUrl = await compressImageForMobile(file);
        const img = new Image();
        img.onload = () => {
          setPdfState(null);
          setBackgroundImage(img);
          setHasImage(true);
          showToast?.(`Imported image slide: ${file.name}`, 'success');
        };
        img.src = dataUrl;
      } catch (err) {
        console.error('Slide upload error:', err);
        alert('Could not load image. Please select a valid PNG or JPG file.');
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Stamp current active NCERT note / formulas directly on board
  const stampWhiteboardNoteOnCanvas = () => {
    if (!whiteboardNote) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.fillStyle = activeColor === '#000000' ? '#ffffff' : activeColor;
    ctx.font = 'bold 18px ui-monospace, SFMono-Regular, Menlo, Monaco, monospace';
    ctx.fillText(`📌 NCERT: ${whiteboardNote.bookTitle || ''} - ${whiteboardNote.title}`, 40, 60);

    ctx.font = '14px ui-monospace, monospace';
    let curY = 95;
    if (whiteboardNote.formulas && whiteboardNote.formulas.length > 0) {
      ctx.fillStyle = '#facc15';
      ctx.fillText('⚡ Key Formulas:', 40, curY);
      curY += 24;
      ctx.fillStyle = '#ffffff';
      whiteboardNote.formulas.slice(0, 4).forEach(form => {
        ctx.fillText(`  • ${form}`, 40, curY);
        curY += 22;
      });
    }

    if (whiteboardNote.points && whiteboardNote.points.length > 0) {
      curY += 8;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🎯 High-Yield Exam Points:', 40, curY);
      curY += 24;
      ctx.fillStyle = '#e2e8f0';
      whiteboardNote.points.slice(0, 3).forEach(pt => {
        const snippet = pt.length > 70 ? `${pt.slice(0, 70)}...` : pt;
        ctx.fillText(`  • ${snippet}`, 40, curY);
        curY += 22;
      });
    }

    ctx.restore();
    saveHistoryState(ctx);
    showToast?.('Stamped NCERT formulas onto canvas! Ready to annotate.', 'success');
  };

  // Mac (⌘Z, ⌘⇧Z) & Windows (Ctrl+Z, Ctrl+Y) keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModifierPressed(e)) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStep, history]);

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `StudyForge-LectureNotes-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-3 pb-12 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4 bg-slate-950 h-screen overflow-hidden' : ''
      }`}
    >
      {/* Responsive Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white/90 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Drawing Tools (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'pen'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pen (Smooth Ink)"
          >
            <PenTool className="w-4 h-4" />
            <span>Pen</span>
          </button>

          <button
            onClick={() => setActiveTool('pencil')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'pencil'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pencil (Fine Line)"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Pencil</span>
          </button>

          <button
            onClick={() => setActiveTool('marker')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'marker'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Highlighter Marker"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden sm:inline">Marker</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'eraser'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
            <span>Eraser</span>
          </button>

          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />

          {/* Geometry Tools */}
          <button
            onClick={() => setActiveTool('ruler')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'ruler'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Ruler (Line with HUD)"
          >
            <Minus className="w-4 h-4 rotate-45" />
            <span className="hidden md:inline">Ruler</span>
          </button>

          <button
            onClick={() => setActiveTool('compass')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'compass'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Compass (Circle with HUD)"
          >
            <Circle className="w-4 h-4" />
            <span className="hidden md:inline">Compass</span>
          </button>

          <button
            onClick={() => setActiveTool('arrow')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'arrow'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Physics Vector Arrow"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('rectangle')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 min-h-[38px] ${
              activeTool === 'rectangle'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Colors, Themes & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Color palette */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {COLOR_PALETTE.map(c => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg transition-transform ${
                  activeColor === c.hex ? 'scale-125 ring-2 ring-white shadow-md' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <input
              type="range"
              min="1"
              max="24"
              value={strokeWidth}
              onChange={e => setStrokeWidth(parseInt(e.target.value))}
              className="w-14 h-1 accent-brand-500 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 w-4">{strokeWidth}</span>
          </div>

          {/* Board Themes dropdown */}
          <select
            value={boardTheme}
            onChange={e => setBoardTheme(e.target.value as BoardTheme)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="pw-dark">PW Dark Board</option>
            <option value="ruled">Ruled Notebook</option>
            <option value="grid">Cartesian Grid</option>
            <option value="white">Whiteboard</option>
            <option value="pure-black">OLED Pure Black</option>
          </select>

          {/* PDF Page Navigation (When a multi-page PDF is loaded) */}
          {pdfState && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
              <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="hidden md:inline truncate max-w-[90px]">{pdfState.fileName}</span>
              <button
                onClick={() => handlePdfPageChange(pdfState.currentPage - 1)}
                disabled={pdfState.currentPage <= 1 || isPdfLoading}
                className="p-1 hover:bg-emerald-500/20 rounded disabled:opacity-20"
                title="Previous PDF Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px]">
                {pdfState.currentPage}/{pdfState.numPages}
              </span>
              <button
                onClick={() => handlePdfPageChange(pdfState.currentPage + 1)}
                disabled={pdfState.currentPage >= pdfState.numPages || isPdfLoading}
                className="p-1 hover:bg-emerald-500/20 rounded disabled:opacity-20"
                title="Next PDF Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Upload Slide / Question Image or PDF */}
          <label
            className="cursor-pointer p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-semibold shrink-0"
            title="Import Lecture Slide, Question Image, or NCERT PDF"
          >
            {isPdfLoading ? (
              <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-brand-500" />
            )}
            <span className="hidden sm:inline">{isPdfLoading ? 'Loading PDF...' : 'Import PDF/Slide'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Remove Slide Image Button (User requested!) */}
          {hasImage && (
            <button
              onClick={handleRemoveImage}
              className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              title="Remove Background Image"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove Slide</span>
            </button>
          )}

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-20"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Clear Board */}
          <button
            onClick={handleClearBoard}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export PNG */}
          <button
            onClick={handleExportPNG}
            className="p-2 sm:px-3 sm:py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-brand-600/20"
            title="Save PNG Notes"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save PNG</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            title="Fullscreen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Measurement HUD (Ruler & Compass dimensions) */}
      {liveInfo && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 border border-brand-500 text-brand-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-2xl animate-pulse">
          {liveInfo}
        </div>
      )}

      {/* Active NCERT Chapter Annotation Sticky Card */}
      {whiteboardNote && (
        <div className="p-3 sm:p-4 bg-slate-900/95 text-white border border-emerald-500/40 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="truncate">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  {whiteboardNote.bookTitle || 'NCERT Book'} &bull; Chapter {whiteboardNote.chapterNumber || ''}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                  {whiteboardNote.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={stampWhiteboardNoteOnCanvas}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
                title="Stamp chapter formulas onto canvas"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Stamp on Board</span>
              </button>
              <button
                onClick={() => setIsNoteMinimized(!isNoteMinimized)}
                className="px-2 py-1 text-slate-400 hover:text-white rounded-lg text-xs"
              >
                {isNoteMinimized ? 'Show' : 'Hide'}
              </button>
              <button
                onClick={() => setWhiteboardNote(null)}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg"
                title="Close NCERT Note"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isNoteMinimized && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-xs">
              {whiteboardNote.formulas && whiteboardNote.formulas.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Formulas to Solve:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {whiteboardNote.formulas.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-black/60 font-mono text-[11px] text-amber-200 border border-amber-500/20">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {whiteboardNote.points && whiteboardNote.points.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                    Key Examination Takeaways:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                    {whiteboardNote.points.slice(0, 2).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Canvas Surface with Touch-Action None for Mobile */}
      <div className="flex-1 w-full rounded-3xl overflow-hidden border-2 border-slate-300 dark:border-slate-800/80 shadow-2xl relative bg-slate-950 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none' }}
          className="w-full h-full block"
        />

        {/* PhysicsWallah Smart Classroom Branding Watermark */}
        <div className="absolute bottom-4 right-5 pointer-events-none select-none flex items-center gap-2 opacity-30 hover:opacity-70 transition-opacity">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xs">
            PW
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-400">
            StudyForge Smart Teacher Board
          </span>
        </div>
      </div>
    </div>
  );
};
