import React from 'react';
import { ArrowUpDown } from 'lucide-react';

type SortField = 'createdAt' | 'updatedAt' | 'title';
type SortOrder = 'asc' | 'desc';

interface CaseSortingProps {
  field: SortField;
  order: SortOrder;
  onSort: (field: SortField, order: SortOrder) => void;
}

export function CaseSorting({ field, order, onSort }: CaseSortingProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center">
        <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Sort by:</span>
      </div>

      <select
        value={`${field}-${order}`}
        onChange={(e) => {
          const [newField, newOrder] = e.target.value.split('-') as [SortField, SortOrder];
          onSort(newField, newOrder);
        }}
        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="updatedAt-desc">Recently Updated</option>
      </select>
    </div>
  );
}