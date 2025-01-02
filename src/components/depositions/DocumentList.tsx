import React, { useState } from 'react';
import { Plus, FileText, Trash } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { DocumentSelectorModal } from './DocumentSelectorModal';
import { useDocuments } from '../../hooks/useDocuments';

interface DocumentListProps {
  documents: string[];
  onChange: (documents: string[]) => void;
}

export function DocumentList({ documents, onChange }: DocumentListProps) {
  const [showSelector, setShowSelector] = useState(false);
  const { documents: availableDocuments } = useDocuments();

  const handleSelect = (documentId: string) => {
    if (!documents.includes(documentId)) {
      onChange([...documents, documentId]);
    }
    setShowSelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Related Documents</h3>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setShowSelector(true)}
        >
          Add Document
        </Button>
      </div>

      <div className="space-y-2">
        {documents.map((documentId) => {
          const doc = availableDocuments?.find(d => d.id === documentId);
          if (!doc) return null;

          return (
            <div
              key={documentId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-900">{doc.title}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Trash className="h-4 w-4" />}
                onClick={() => onChange(documents.filter(id => id !== documentId))}
              />
            </div>
          );
        })}
      </div>

      {showSelector && (
        <DocumentSelectorModal
          onSelect={handleSelect}
          onClose={() => setShowSelector(false)}
          selectedIds={documents}
        />
      )}
    </div>
  );
}