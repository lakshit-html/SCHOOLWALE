// PDF Rendering Service for Whiteboard using Mozilla PDF.js

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfjsLoadingPromise: Promise<any> | null = null;

export const loadPdfJs = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js is only available in browser environments.');
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  if (pdfjsLoadingPromise) {
    return pdfjsLoadingPromise;
  }

  pdfjsLoadingPromise = new Promise((resolve, reject) => {
    // Check if script element already exists
    const existing = document.querySelector(`script[src="${PDFJS_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('PDF.js script loaded but window.pdfjsLib is undefined'));
        }
      });
      existing.addEventListener('error', () => reject(new Error('Failed to load PDF.js from CDN')));
      return;
    }

    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to initialize window.pdfjsLib'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js CDN script'));
    document.head.appendChild(script);
  });

  return pdfjsLoadingPromise;
};

export interface LoadedPdf {
  pdfDoc: any;
  numPages: number;
  fileName: string;
}

export const loadPdfDocument = async (file: File): Promise<LoadedPdf> => {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  return {
    pdfDoc,
    numPages: pdfDoc.numPages,
    fileName: file.name
  };
};

export const renderPdfPageToImage = async (
  pdfDoc: any,
  pageNumber: number,
  targetWidth: number = 1920
): Promise<HTMLImageElement> => {
  const page = await pdfDoc.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1.0 });

  // Calculate crisp scale factor for high-resolution displays
  const scale = Math.max(1.5, Math.min(3.0, targetWidth / baseViewport.width));
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create 2D canvas context for PDF rendering');
  }

  // Paint white background so transparent PDFs render legibly
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to convert PDF page ${pageNumber} to image`));
    img.src = canvas.toDataURL('image/png');
  });
};
