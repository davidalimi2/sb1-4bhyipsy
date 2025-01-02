import React from 'react';
import { Edit, Archive } from 'lucide-react';
import { CaseStatusBadge } from './CaseStatusBadge';
import type { Case } from '../../../types';

interface CaseDetailsHeaderProps {
  caseData: Case;
  onEdit?: () => void;
  onClose?: () => void;
}

export function CaseDetailsHeader({ caseData, onEdit, onClose }: CaseDetailsHeaderProps) {
  return (
    <div className="pb-5 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{caseData.title}</h2>
          <div className="mt-1 flex items-center space-x-4">
            <CaseStatusBadge status={caseData.status} />
            <span className="text-sm text-gray-500">
              Created on {new Date(caseData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
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
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{caseData.description}</p>
    </div>
  );
}