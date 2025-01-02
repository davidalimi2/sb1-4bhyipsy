import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentStatus } from './DocumentStatus';
import type { Document } from '../../../types/document';

interface DocumentCardHeaderProps {
  document: Document;
}

export function DocumentCardHeader({ document }: DocumentCardHeaderProps) {
  return (
    <div className="flex items-start space-x-3">
      <FileText className="h-5 w-5 text-gray-400 mt-1" />
      <div>
        <h4 className="text-sm font-medium text-gray-900">{document.title}</h4>
        <DocumentStatus status={document.status} />
      </div>
    </div>
  );
}