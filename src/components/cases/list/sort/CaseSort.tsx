import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select } from '../../../shared/ui';
import type { SortConfig } from '../../../../types/case';

interface CaseSortProps {
  config: SortConfig;
  onChange: (config: SortConfig) => void;
}

export function CaseSort({ config, onChange }: CaseSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-5 w-5 text-gray-400" />
      <Select
        value={`${config.field}-${config.order}`}
        onChange={(e) => {
          const [field, order] = e.target.value.split('-') as [SortConfig['field'], SortConfig['order']];
          onChange({ field, order });
        }}
      >
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="updatedAt-desc">Recently Updated</option>
      </Select>
    </div>
  );
}