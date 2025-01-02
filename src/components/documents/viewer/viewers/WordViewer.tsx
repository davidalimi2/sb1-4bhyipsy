import React from 'react';
import { FileText } from 'lucide-react';

interface WordViewerProps {
  url: string;
  title: string;
}

export function WordViewer({ url, title }: WordViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
      <FileText className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium">Word Document Preview</p>
      <p className="text-sm mt-2">
        Word documents cannot be previewed directly. Please download to view.
      </p>
      <a
        href={url}
        download={title}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Download Document
      </a>
    </div>
  );
}