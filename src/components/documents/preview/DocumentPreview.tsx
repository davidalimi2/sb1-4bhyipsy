import React from 'react';
import { DocumentPreviewHeader } from './DocumentPreviewHeader';
import { ViewerContainer } from '../viewer/ViewerContainer';
import { DocumentPreviewActions } from './DocumentPreviewActions';
import { VersionList } from '../versions/VersionList';
import { useDocumentVersions } from '../../../hooks/documents/useDocumentVersions';
import type { Document, DocumentVersion } from '../../../types/document';

interface DocumentPreviewProps {
  document: Document;
  version?: DocumentVersion;
  url: string | null;
  isLoading: boolean;
  error?: string | null;
  onClose: () => void;
  onVersionSelect?: (version: DocumentVersion) => void;
  onEdit?: () => void;
}

export function DocumentPreview({
  document,
  version,
  url,
  isLoading,
  error,
  onClose,
  onVersionSelect,
  onEdit
}: DocumentPreviewProps) {
  const { versions } = useDocumentVersions(document.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          <DocumentPreviewHeader
            document={document}
            version={version}
            onClose={onClose}
          />
          
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 overflow-auto">
              <ViewerContainer
                document={document}
                url={url}
                isLoading={isLoading}
                error={error}
              />
            </div>
            
            {versions.length > 0 && onVersionSelect && (
              <div className="w-80 border-l border-gray-200 overflow-y-auto">
                <VersionList
                  document={document}
                  activeVersion={version}
                  onVersionSelect={onVersionSelect}
                />
              </div>
            )}
          </div>

          <DocumentPreviewActions
            document={document}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
}