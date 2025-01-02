import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  title: string;
  onSignaturePlace?: (position: { x: number; y: number; page: number }) => void;
  isSignatureMode?: boolean;
}

export function PDFViewer({ url, title, onSignaturePlace, isSignatureMode }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setNumPages(pdfDoc.numPages);
        await renderPage(pdfDoc, 1);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  const renderPage = async (pdfDoc: any, pageNum: number) => {
    if (!canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;
  };

  useEffect(() => {
    if (pdf) {
      renderPage(pdf, pageNumber);
    }
  }, [pageNumber, scale, pdf]);

  const handlePageClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSignatureMode || !onSignaturePlace || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onSignaturePlace({ x, y, page: pageNumber });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1}
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
            disabled={pageNumber >= numPages}
            icon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          >
            -
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
          >
            +
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div 
            className={`relative mx-auto ${isSignatureMode ? 'cursor-crosshair' : ''}`}
            style={{ width: `${scale * 100}%`, maxWidth: '1000px' }}
          >
            <canvas
              ref={canvasRef}
              onClick={handlePageClick}
              className="w-full shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}