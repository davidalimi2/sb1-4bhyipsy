import React from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../search/SearchBar';
import { CaseFilters } from './CaseFilters';
import { CaseSorting } from './CaseSorting';
import type { Case } from '../../types';

interface CaseListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType?: Case['type'];
  selectedStatus?: Case['status'];
  onTypeChange: (type: Case['type'] | undefined) => void;
  onStatusChange: (status: Case['status'] | undefined) => void;
  sortField: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'createdAt' | 'updatedAt' | 'title', order: 'asc' | 'desc') => void;
}

export function CaseListHeader({
  searchQuery,
  onSearchChange,
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
  sortField,
  sortOrder,
  onSort,
}: CaseListHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cases</h2>
        <button
          onClick={() => window.location.href = '/cases/new'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <div className="flex space-x-4">
          <CaseFilters
            selectedType={selectedType}
            selectedStatus={selectedStatus}
            onTypeChange={onTypeChange}
            onStatusChange={onStatusChange}
          />
          <CaseSorting
            field={sortField}
            order={sortOrder}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
}