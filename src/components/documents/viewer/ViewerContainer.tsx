import React from 'react';
import { FileViewer } from './FileViewer';
import { ViewerError } from './ViewerError';
import { ViewerLoading } from './ViewerLoading';
import type { Document } from '../../../types/document';

interface ViewerContainerProps {
  document: Document;
  url: string | null;
  isLoading: boolean;
  error?: string | null;
}

export function ViewerContainer({
  document,
  url,
  isLoading,
  error
}: ViewerContainerProps) {
  if (isLoading) {
    return <ViewerLoading />;
  }

  if (error) {
    return <ViewerError error={error} />;
  }

  if (!url) {
    return <ViewerError error="Unable to load document preview" />;
  }

  return <FileViewer document={document} url={url} />;
}