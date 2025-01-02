import React from 'react';
import { Filter } from 'lucide-react';
import { Select } from '../shared/ui/Select';
import type { TemplateCategory } from '../../types/template';

interface TemplateFiltersProps {
  category?: TemplateCategory;
  jurisdiction?: string;
  onCategoryChange: (category?: TemplateCategory) => void;
  onJurisdictionChange: (jurisdiction?: string) => void;
}

export function TemplateFilters({
  category,
  jurisdiction,
  onCategoryChange,
  onJurisdictionChange
}: TemplateFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Filters:</span>
      </div>

      <Select
        value={category || ''}
        onChange={(e) => onCategoryChange(e.target.value as TemplateCategory || undefined)}
        className="w-40"
      >
        <option value="">All Categories</option>
        <option value="lawsuit">Lawsuits</option>
        <option value="contract">Contracts</option>
        <option value="motion">Motions</option>
        <option value="response">Responses</option>
      </Select>

      <Select
        value={jurisdiction || ''}
        onChange={(e) => onJurisdictionChange(e.target.value || undefined)}
        className="w-40"
      >
        <option value="">All Jurisdictions</option>
        <option value="federal">Federal</option>
        <option value="state">State</option>
      </Select>
    </div>
  );
}