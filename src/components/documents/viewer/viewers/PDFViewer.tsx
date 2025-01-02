import React from 'react';

interface PDFViewerProps {
  url: string;
  title: string;
}

export function PDFViewer({ url, title }: PDFViewerProps) {
  return (
    <object
      data={url}
      type="application/pdf"
      className="w-full h-full min-h-[600px]"
      title={title}
    >
      <p>PDF preview not available. Please download to view.</p>
    </object>
  );
}