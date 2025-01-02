import React from 'react';
import { Filter } from 'lucide-react';
import { getCaseTypeLabel } from '../../utils/caseUtils';
import type { Case } from '../../types';

interface CaseFiltersProps {
  selectedType?: Case['type'];
  selectedStatus?: Case['status'];
  onTypeChange: (type: Case['type'] | undefined) => void;
  onStatusChange: (status: Case['status'] | undefined) => void;
}

export function CaseFilters({ 
  selectedType, 
  selectedStatus, 
  onTypeChange, 
  onStatusChange 
}: CaseFiltersProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Filters:</span>
      </div>
      
      <select
        value={selectedType || ''}
        onChange={(e) => onTypeChange(e.target.value as Case['type'] || undefined)}
        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">All Types</option>
        {['civil', 'family', 'small_claims'].map(type => (
          <option key={type} value={type}>
            {getCaseTypeLabel(type as Case['type'])}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus || ''}
        onChange={(e) => onStatusChange(e.target.value as Case['status'] || undefined)}
        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}