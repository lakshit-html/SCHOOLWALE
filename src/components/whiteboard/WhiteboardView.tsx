import React, { useState, useRef, useEffect } from 'react';
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
  Minimize2
} from 'lucide-react';

type ToolType =
  | 'pen'
  | 'pencil'
  | 'marker'
  | 'eraser'
  | 'ruler'
  | 'compass'
  | 'arrow'
  | 'rectangle'
  | 'text';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [activeColor, setActiveColor] = useState<string>('#facc15'); // PW yellow default
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('pw-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [liveInfo, setLiveInfo] = useState<string | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Background PDF / Image
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = Math.max(680, window.innerHeight - 200);

      // Save current content before resize
      let ctx: CanvasRenderingContext2D | null = null;
      try {
        ctx = canvas.getContext('2d');
      } catch {
        // Safe fallback in environments without full canvas implementation
      }
      let prevData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        prevData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        drawBoardBackground(ctx, width, height, boardTheme);
        if (backgroundImage) {
          drawUploadedImage(ctx, backgroundImage, width, height);
        }
        if (prevData) {
          ctx.putImageData(prevData, 0, 0);
        } else {
          // Push initial clean state to history
          saveHistoryState(ctx);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [boardTheme, backgroundImage]);

  const drawBoardBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    theme: BoardTheme
  ) => {
    ctx.save();
    if (theme === 'pw-dark') {
      // PhysicsWallah dark classroom board (Deep emerald slate)
      ctx.fillStyle = '#0b1914';
      ctx.fillRect(0, 0, width, height);

      // Faint coordinate dot grid
      ctx.fillStyle = '#164e3c33';
      const spacing = 32;
      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (theme === 'grid') {
      // Cartesian Engineering Graph
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const spacing = 24;
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
      // Ruled Notebook Lines
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      const lineSpacing = 30;
      for (let y = 60; y < height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Red margin line
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
  };

  const drawUploadedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number
  ) => {
    ctx.save();
    const hRatio = (canvasW * 0.85) / img.width;
    const vRatio = (canvasH * 0.85) / img.height;
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
  };

  const saveHistoryState = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    if (newHistory.length > 25) newHistory.shift();
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextStep = historyStep - 1;
    ctx.putImageData(history[nextStep], 0, 0);
    setHistoryStep(nextStep);
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextStep = historyStep + 1;
    ctx.putImageData(history[nextStep], 0, 0);
    setHistoryStep(nextStep);
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

  // Drawing event handlers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'eraser') {
      applyStrokeSettings(ctx);
    }
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
      ctx.lineWidth = Math.max(22, strokeWidth * 4);
      ctx.globalAlpha = 0.35;
    } else if (activeTool === 'eraser') {
      // Eraser matches board background or acts as clearRect
      ctx.strokeStyle = boardTheme === 'white' ? '#ffffff' : '#0b1914';
      ctx.lineWidth = strokeWidth * 6;
      ctx.globalAlpha = 1.0;
    } else {
      // Regular smooth Pen
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 1.0;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e);
    setCurrentPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (activeTool === 'pen' || activeTool === 'pencil' || activeTool === 'marker' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'ruler') {
      // Straight line with length & angle calculation
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
      // Circle with radius calculation
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

      setLiveInfo(`⭕ Compass: Radius = ${radius}px (Area: ${Math.round(Math.PI * radius * radius)}px²)`);
    } else if (activeTool === 'arrow') {
      // Physics Vector Arrow
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

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
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
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fillStyle = activeColor;
    ctx.fill();
  };

  // Upload PDF or Image onto Whiteboard
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              drawUploadedImage(ctx, img, canvas.width, canvas.height);
              saveHistoryState(ctx);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // If PDF or other document format
      alert('For best resolution on the digital board, select an image/slide of your DPP or question paper.');
    }
  };

  // Export board as high-resolution PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `StudyForge-Whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-4 pb-12 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-950 h-screen overflow-hidden' : ''
      }`}
    >
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 dark:bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Left: Tools Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'pen'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Pen (Smooth Ink)"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Pen</span>
          </button>

          <button
            onClick={() => setActiveTool('pencil')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'pencil'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Pencil (Fine Sketch)"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Pencil</span>
          </button>

          <button
            onClick={() => setActiveTool('marker')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'marker'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Highlighter / Marker"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden sm:inline">Marker</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1" />

          {/* Academic Geometry Tools */}
          <button
            onClick={() => setActiveTool('ruler')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'ruler'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Ruler (Straight Line with cm & angle HUD)"
          >
            <Minus className="w-4 h-4 rotate-45" />
            <span className="hidden md:inline">Ruler</span>
          </button>

          <button
            onClick={() => setActiveTool('compass')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'compass'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Compass (Perfect Circles with radius HUD)"
          >
            <Circle className="w-4 h-4" />
            <span className="hidden md:inline">Compass</span>
          </button>

          <button
            onClick={() => setActiveTool('arrow')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'arrow'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Physics Vector / Arrow"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden md:inline">Vector</span>
          </button>

          <button
            onClick={() => setActiveTool('rectangle')}
            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTool === 'rectangle'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Rectangle Box"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Color & Thickness */}
        <div className="flex items-center gap-2">
          {/* Color palette */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {COLOR_PALETTE.map(c => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                className={`w-6 h-6 rounded-lg transition-transform ${
                  activeColor === c.hex ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Stroke Width Slider */}
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-slate-950/70 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400">Width</span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={e => setStrokeWidth(parseInt(e.target.value))}
              className="w-16 h-1 accent-teal-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-teal-300 w-4">{strokeWidth}</span>
          </div>
        </div>

        {/* Right: Board Themes, Import Image, Export & Actions */}
        <div className="flex items-center gap-1.5">
          {/* Board Theme Selector */}
          <select
            value={boardTheme}
            onChange={e => setBoardTheme(e.target.value as BoardTheme)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="pw-dark">PW Dark Board</option>
            <option value="grid">Cartesian Grid</option>
            <option value="ruled">Ruled Notebook</option>
            <option value="white">Dry-Erase White</option>
            <option value="pure-black">OLED Pure Black</option>
          </select>

          {/* Upload PDF / Image onto Board */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Import Lecture Slide / DPP Image to Annotate"
          >
            <Upload className="w-4 h-4 text-teal-400" />
            <span className="hidden lg:inline text-xs font-semibold">Import Slide/DPP</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Clear Board */}
          <button
            onClick={handleClearBoard}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Export PNG */}
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20"
            title="Download Handwritten Notes"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save PNG</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            title={isFullscreen ? 'Exit Fullscreen' : 'Teacher Fullscreen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Measurement HUD (Ruler & Compass live dimensions) */}
      {liveInfo && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 border border-teal-500/60 text-teal-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-pulse">
          {liveInfo}
        </div>
      )}

      {/* Digital Blackboard Canvas Surface */}
      <div className="flex-1 w-full rounded-3xl overflow-hidden border-2 border-slate-800/80 shadow-2xl relative bg-slate-950 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full block touch-none"
        />

        {/* PhysicsWallah / Digital Teacher Watermark */}
        <div className="absolute bottom-4 right-5 pointer-events-none select-none flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xs">
            SF
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-400">
            StudyForge Smart Teacher Board
          </span>
        </div>
      </div>
    </div>
  );
};
