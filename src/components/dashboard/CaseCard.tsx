import React from 'react';
import { Clock, FileText } from 'lucide-react';
import type { Case } from '../../types';

interface CaseCardProps {
  caseData: Case;
}

export function CaseCard({ caseData }: CaseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{caseData.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{caseData.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          caseData.status === 'open' ? 'bg-green-100 text-green-800' :
          caseData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {caseData.status}
        </span>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{new Date(caseData.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-1" />
          <span>View Details</span>
        </div>
      </div>
    </div>
  );
}