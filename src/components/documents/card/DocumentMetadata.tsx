import React from 'react';
import { Clock, User } from 'lucide-react';
import { formatFileSize } from '../../../utils/format';
import type { Document } from '../../../types/document';

interface DocumentMetadataProps {
  document: Document;
}

export function DocumentMetadata({ document }: DocumentMetadataProps) {
  return (
    <div className="flex items-center space-x-4 text-xs text-gray-500">
      <div className="flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        <span>{new Date(document.updated_at).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center">
        <User className="h-3 w-3 mr-1" />
        <span>{formatFileSize(document.size)}</span>
      </div>
    </div>
  );
}