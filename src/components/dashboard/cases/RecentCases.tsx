import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useActiveCases } from '../../../hooks/useActiveCases';
import { CaseCard } from '../../cases/CaseCard';

export function RecentCases() {
  const { cases, isLoading } = useActiveCases();
  const recentCases = cases?.slice(0, 3);

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Cases</h2>
        <Button
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => window.location.href = '/cases/new'}
        >
          New Case
        </Button>
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
    </Card>
  );
}