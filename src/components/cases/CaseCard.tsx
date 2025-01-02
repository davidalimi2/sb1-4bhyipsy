import React from 'react';
import { CaseStatus } from './CaseStatus';
import { CaseMetadata } from './CaseMetadata';
import { CaseActions } from './CaseActions';
import type { Case } from '../../types';

interface CaseCardProps {
  caseData: Case;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CaseCard({ caseData, onEdit, onDelete }: CaseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{caseData.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{caseData.description}</p>
        </div>
        <CaseStatus status={caseData.status} />
      </div>
      
      <div className="mt-4 space-y-4">
        <CaseMetadata caseData={caseData} />
        <CaseActions 
          caseData={caseData}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}