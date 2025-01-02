import React from 'react';
import { CaseCard } from '../CaseCard';
import { EmptyState } from '../../shared/EmptyState';
import type { Case } from '../../../types';

interface CaseListContentProps {
  cases: Case[];
  isLoading: boolean;
}

export function CaseListContent({ cases, isLoading }: CaseListContentProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!cases.length) {
    return (
      <EmptyState
        title="No cases found"
        description="Get started by creating your first case"
        action={{
          label: "Create Case",
          href: "/cases/new"
        }}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map(caseData => (
        <CaseCard
          key={caseData.id}
          caseData={caseData}
        />
      ))}
    </div>
  );
}