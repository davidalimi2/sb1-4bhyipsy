import React from 'react';
import { Download, Edit } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { canEditDocument } from '../../../utils/documentUtils';
import { formatDateTime } from '../../../utils/date';
import type { Document } from '../../../types/document';

interface DocumentPreviewActionsProps {
  document: Document;
  onEdit?: () => void;
}

export function DocumentPreviewActions({ document, onEdit }: DocumentPreviewActionsProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
      <div className="text-sm text-gray-500">
        Created {formatDateTime(document.created_at)}
      </div>
      <div className="flex space-x-3">
        {canEditDocument(document) && onEdit && (
          <Button
            variant="secondary"
            icon={<Edit className="h-4 w-4" />}
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        <Button
          variant="primary"
          icon={<Download className="h-4 w-4" />}
          onClick={() => window.open(document.storage_path, '_blank')}
        >
          Download
        </Button>
      </div>
    </div>
  );
}