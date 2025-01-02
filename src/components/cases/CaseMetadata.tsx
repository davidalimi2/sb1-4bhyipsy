import React from 'react';
import { User, Calendar } from 'lucide-react';
import { CaseDate } from './CaseDate';
import type { Case } from '../../types/case';

interface CaseMetadataProps {
  caseData: Case;
}

export function CaseMetadata({ caseData }: CaseMetadataProps) {
  return (
    <div className="flex items-center space-x-6 text-sm text-gray-500">
      <CaseDate date={caseData.created_at} />
      {caseData.lawyer_id && (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>Lawyer Assigned</span>
        </div>
      )}
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Updated {new Date(caseData.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}