import React from 'react';
import type { Case } from '../../../../types';

interface CaseDetailsTabProps {
  caseData: Case;
}

export function CaseDetailsTab({ caseData }: CaseDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Case Type</h4>
          <p className="mt-1 text-sm text-gray-900">{caseData.type}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Filed Date</h4>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(caseData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(caseData.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Status</h4>
          <p className="mt-1 text-sm text-gray-900">{caseData.status}</p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">Description</h4>
        <p className="mt-1 text-sm text-gray-900">{caseData.description}</p>
      </div>
    </div>
  );
}