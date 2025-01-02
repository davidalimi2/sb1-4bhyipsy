import React from 'react';
import { X } from 'lucide-react';
import { DocumentViewer } from './DocumentViewer';

interface PreviewModalProps {
  url: string;
  title: string;
  mimeType: string;
  onClose: () => void;
}

export function PreviewModal({ url, title, mimeType, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <DocumentViewer url={url} title={title} mimeType={mimeType} />
          </div>
        </div>
      </div>
    </div>
  );
}