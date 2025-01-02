import { useState, useMemo } from 'react';
import { useActiveCases } from './useActiveCases';
import { filterCases } from '../../utils/caseUtils';
import { sortCases } from '../../utils/sortUtils';
import type { CaseFilters, SortConfig } from '../../types/case';

export function useCaseList() {
  const { cases, isLoading } = useActiveCases();
  const [filters, setFilters] = useState<CaseFilters>({
    search: '',
    type: undefined,
    status: undefined
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'createdAt',
    order: 'desc'
  });

  const filteredAndSortedCases = useMemo(() => {
    if (!cases) return [];
    
    const filtered = filterCases(cases, filters);
    return sortCases(filtered, sortConfig);
  }, [cases, filters, sortConfig]);

  return {
    cases: filteredAndSortedCases,
    isLoading,
    filters,
    setFilters,
    sortConfig,
    setSortConfig
  };
}