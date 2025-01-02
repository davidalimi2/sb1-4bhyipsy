import React from 'react';
import { CaseListHeader } from './CaseListHeader';
import { CaseListContent } from './CaseListContent';
import { useCaseList } from '../../../hooks/cases/useCaseList';

export function CaseList() {
  const {
    cases,
    isLoading,
    filters,
    setFilters,
    sortConfig,
    setSortConfig
  } = useCaseList();

  return (
    <div className="space-y-6">
      <CaseListHeader
        filters={filters}
        onFiltersChange={setFilters}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />
      <CaseListContent
        cases={cases}
        isLoading={isLoading}
      />
    </div>
  );
}