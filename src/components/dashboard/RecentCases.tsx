import React from 'react';
import { useActiveCases } from '../../hooks/useActiveCases';
import { CaseCard } from '../cases/CaseCard';
import { Plus } from 'lucide-react';

export function RecentCases() {
  const { cases, isLoading } = useActiveCases();
  const recentCases = cases?.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Cases</h2>
        <button
          onClick={() => window.location.href = '/cases/new'}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Case
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recentCases?.map(caseData => (
            <CaseCard
              key={caseData.id}
              caseData={caseData}
              onEdit={() => window.location.href = `/cases/${caseData.id}/edit`}
              onDelete={() => {
                // Implement delete functionality
                console.log('Delete case:', caseData.id);
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/cases"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all cases →
        </a>
      </div>
    </div>
  );
}