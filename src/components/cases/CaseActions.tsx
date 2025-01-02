import React from 'react';
import { FileText, Trash, Edit } from 'lucide-react';
import { canDeleteCase, isCaseEditable } from '../../utils/caseUtils';
import type { Case } from '../../types';

interface CaseActionsProps {
  caseData: Case;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CaseActions({ caseData, onEdit, onDelete }: CaseActionsProps) {
  return (
    <div className="flex items-center space-x-4">
      <button 
        className="flex items-center text-indigo-600 hover:text-indigo-900"
        onClick={() => window.location.href = `/cases/${caseData.id}`}
      >
        <FileText className="h-4 w-4 mr-1" />
        <span>View Details</span>
      </button>
      
      {isCaseEditable(caseData) && onEdit && (
        <button 
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          <span>Edit</span>
        </button>
      )}
      
      {canDeleteCase(caseData) && onDelete && (
        <button 
          className="flex items-center text-red-600 hover:text-red-900"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4 mr-1" />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
}