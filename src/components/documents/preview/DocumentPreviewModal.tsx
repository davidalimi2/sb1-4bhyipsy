import React from 'react';
import { X } from 'lucide-react';
import { DocumentPreviewHeader } from './DocumentPreviewHeader';
import { DocumentPreviewContent } from './DocumentPreviewContent';
import { DocumentVersions } from '../versions/DocumentVersions';
import { useDocumentPreview } from '../../../hooks/documents/useDocumentPreview';
import type { Document } from '../../../types/document';

interface DocumentPreviewModalProps {
  document: Document;
  onClose: () => void;
}

export function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  const { activeVersion, setActiveVersion } = useDocumentPreview(document);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <DocumentPreviewHeader document={document} version={activeVersion} />
          
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 overflow-auto">
              <DocumentPreviewContent document={document} version={activeVersion} />
            </div>
            
            <div className="w-80 border-l border-gray-200 overflow-y-auto">
              <DocumentVersions
                document={document}
                activeVersion={activeVersion}
                onVersionSelect={setActiveVersion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}