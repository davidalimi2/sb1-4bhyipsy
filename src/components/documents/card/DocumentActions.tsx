import React from 'react';
import { Download, Edit, Trash } from 'lucide-react';
import { canEditDocument, canDeleteDocument } from '../../../utils/documentUtils';
import type { Document } from '../../../types/document';

interface DocumentActionsProps {
  document: Document;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload: () => void;
}

export function DocumentActions({ document, onEdit, onDelete, onDownload }: DocumentActionsProps) {
  return (
    <div className="flex space-x-2">
      <button 
        className="p-1 text-gray-400 hover:text-gray-600"
        onClick={onDownload}
        title="Download"
      >
        <Download className="h-4 w-4" />
      </button>
      {canEditDocument(document) && onEdit && (
        <button 
          className="p-1 text-gray-400 hover:text-gray-600"
          onClick={onEdit}
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </button>
      )}
      {canDeleteDocument(document) && onDelete && (
        <button 
          className="p-1 text-gray-400 hover:text-red-600"
          onClick={onDelete}
          title="Delete"
        >
          <Trash className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}