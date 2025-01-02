import React from 'react';
import { FileText } from 'lucide-react';

interface ViewerErrorProps {
  error: string;
}

export function ViewerError({ error }: ViewerErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
      <FileText className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium">Failed to load preview</p>
      <p className="text-sm mt-2">{error}</p>
    </div>
  );
}