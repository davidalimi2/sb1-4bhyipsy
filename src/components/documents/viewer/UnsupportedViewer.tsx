import React from 'react';
import { FileText } from 'lucide-react';

interface UnsupportedViewerProps {
  title: string;
}

export function UnsupportedViewer({ title }: UnsupportedViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
      <FileText className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium">Preview not available</p>
      <p className="text-sm mt-2">
        {title} cannot be previewed. Please download to view.
      </p>
    </div>
  );
}