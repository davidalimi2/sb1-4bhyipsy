import React from 'react';
import { DocumentCardHeader } from './DocumentCardHeader';
import { DocumentMetadata } from './DocumentMetadata';
import { DocumentActions } from './DocumentActions';
import { DocumentPreview } from '../preview/DocumentPreview';
import { usePreview } from '../../../hooks/documents/usePreview';
import type { Document } from '../../../types/document';

interface DocumentCardProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DocumentCard({ document, onEdit, onDelete }: DocumentCardProps) {
  const { previewUrl, isLoading, error, openPreview, closePreview } = usePreview();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <DocumentCardHeader document={document} onClick={() => openPreview(document)} />
          <DocumentActions
            document={document}
            onEdit={onEdit}
            onDelete={onDelete}
            onPreview={() => openPreview(document)}
          />
        </div>
        <div className="mt-2">
          <DocumentMetadata document={document} />
        </div>
      </div>

      {previewUrl && (
        <DocumentPreview
          document={document}
          url={previewUrl}
          isLoading={isLoading}
          error={error}
          onClose={closePreview}
          onEdit={onEdit}
        />
      )}
    </>
  );
}