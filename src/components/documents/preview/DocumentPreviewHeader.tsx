import React from 'react';
import { X } from 'lucide-react';
import { DocumentStatus } from '../card/DocumentStatus';
import { formatDateTime } from '../../../utils/date';
import type { Document } from '../../../types/document';

interface DocumentPreviewHeaderProps {
  document: Document;
  onClose: () => void;
}

export function DocumentPreviewHeader({ document, onClose }: DocumentPreviewHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            {document.title}
          </h2>
          <div className="mt-1 flex items-center space-x-4">
            <DocumentStatus status={document.status} />
            <span className="text-sm text-gray-500">
              Last updated {formatDateTime(document.updated_at)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}