import React from 'react';
import { Search } from 'lucide-react';
import { Input, Select } from '../../../shared/ui';
import type { CaseFilters as Filters } from '../../../../types/case';

interface CaseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function CaseFilters({ filters, onChange }: CaseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-64">
        <Input
          placeholder="Search cases..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          icon={<Search className="h-5 w-5 text-gray-400" />}
        />
      </div>
      
      <Select
        value={filters.type || ''}
        onChange={(e) => onChange({ ...filters, type: e.target.value || undefined })}
      >
        <option value="">All Types</option>
        <option value="civil">Civil Case</option>
        <option value="family">Family Law</option>
        <option value="small_claims">Small Claims</option>
      </Select>

      <Select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </Select>
    </div>
  );
}