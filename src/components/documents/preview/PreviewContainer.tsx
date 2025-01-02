import React from 'react';
import { PreviewModal } from './PreviewModal';
import { useDocumentPreview } from '../../../hooks/documents/useDocumentPreview';
import type { Document } from '../../../types/document';

interface PreviewContainerProps {
  children: React.ReactNode;
  document: Document;
  onEdit?: () => void;
}

export function PreviewContainer({
  children,
  document,
  onEdit
}: PreviewContainerProps) {
  const {
    document: previewDocument,
    version,
    url,
    isLoading,
    error,
    openPreview,
    closePreview
  } = useDocumentPreview();

  return (
    <>
      <div onClick={() => openPreview(document)}>
        {children}
      </div>

      {previewDocument && (
        <PreviewModal
          document={previewDocument}
          version={version}
          url={url}
          isLoading={isLoading}
          error={error}
          onClose={closePreview}
          onEdit={onEdit}
        />
      )}
    </>
  );
}