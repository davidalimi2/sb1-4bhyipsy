import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui';
import { CaseFilters } from './filters/CaseFilters';
import { CaseSort } from './sort/CaseSort';
import type { CaseFilters as Filters, SortConfig } from '../../../types/case';

interface CaseListHeaderProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

export function CaseListHeader({
  filters,
  onFiltersChange,
  sortConfig,
  onSortChange
}: CaseListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <Button
          href="/cases/new"
          icon={<Plus className="h-4 w-4" />}
        >
          New Case
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CaseFilters
          filters={filters}
          onChange={onFiltersChange}
        />
        <CaseSort
          config={sortConfig}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}