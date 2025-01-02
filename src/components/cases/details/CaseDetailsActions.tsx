import React from 'react';
import { Edit, Archive, Trash } from 'lucide-react';
import { canDeleteCase } from '../../../utils/caseUtils';
import type { Case } from '../../../types';

interface CaseDetailsActionsProps {
  caseData: Case;
  onEdit?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
}

export function CaseDetailsActions({ caseData, onEdit, onClose, onDelete }: CaseDetailsActionsProps) {
  return (
    <div className="flex space-x-3">
      {onEdit && caseData.status !== 'closed' && (
        <button
          onClick={onEdit}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Case
        </button>
      )}
      
      {onClose && caseData.status !== 'closed' && (
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Archive className="h-4 w-4 mr-2" />
          Close Case
        </button>
      )}

      {onDelete && canDeleteCase(caseData) && (
        <button
          onClick={onDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Case
        </button>
      )}
    </div>
  );
}