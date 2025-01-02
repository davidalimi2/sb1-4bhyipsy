import React from 'react';
import { DocumentViewer } from './DocumentViewer';
import type { Document } from '../../../types/document';

interface DocumentPreviewContentProps {
  url: string | null;
  title: string;
  isLoading: boolean;
  error?: string | null;
}

export function DocumentPreviewContent({
  url,
  title,
  isLoading,
  error
}: DocumentPreviewContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <DocumentViewer
        url={url}
        title={title}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}