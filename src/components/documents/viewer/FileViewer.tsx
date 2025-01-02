import React from 'react';
import { PDFViewer } from './viewers/PDFViewer';
import { TextViewer } from './viewers/TextViewer';
import { WordViewer } from './viewers/WordViewer';
import { UnsupportedViewer } from './viewers/UnsupportedViewer';
import type { Document } from '../../../types/document';

interface FileViewerProps {
  document: Document;
  url: string;
}

export function FileViewer({ document, url }: FileViewerProps) {
  switch (document.mime_type) {
    case 'application/pdf':
      return <PDFViewer url={url} title={document.title} />;
      
    case 'text/plain':
      return <TextViewer url={url} title={document.title} />;
      
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <WordViewer url={url} title={document.title} />;
      
    default:
      return <UnsupportedViewer title={document.title} />;
  }
}