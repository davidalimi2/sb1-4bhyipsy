import React from 'react';
import { Select } from '../shared/ui/Select';
import { Input } from '../shared/ui/Input';
import type { LawyerFilters as Filters } from '../../types/lawyer';

interface LawyerFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
}

export function LawyerFilters({ filters, onChange }: LawyerFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Select
          label="Practice Area"
          value={filters.practiceArea}
          onChange={(e) => onChange({ practiceArea: e.target.value })}
        >
          <option value="">All Practice Areas</option>
          <option value="civil">Civil Litigation</option>
          <option value="family">Family Law</option>
          <option value="criminal">Criminal Defense</option>
          <option value="business">Business Law</option>
          <option value="real_estate">Real Estate</option>
          <option value="immigration">Immigration</option>
        </Select>

        <Select
          label="Experience Level"
          value={filters.experienceLevel}
          onChange={(e) => onChange({ experienceLevel: e.target.value })}
        >
          <option value="">Any Experience</option>
          <option value="junior">1-5 years</option>
          <option value="mid">5-10 years</option>
          <option value="senior">10+ years</option>
        </Select>

        <Input
          type="number"
          label="Max Hourly Rate"
          value={filters.maxRate || ''}
          onChange={(e) => onChange({ maxRate: parseInt(e.target.value) || undefined })}
          placeholder="Enter maximum rate"
        />

        <Select
          label="Rating"
          value={filters.minRating}
          onChange={(e) => onChange({ minRating: e.target.value })}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="5">5 Stars</option>
        </Select>

        <Select
          label="Availability"
          value={filters.availability}
          onChange={(e) => onChange({ availability: e.target.value })}
        >
          <option value="">Any Availability</option>
          <option value="immediate">Immediate</option>
          <option value="within_week">Within a Week</option>
          <option value="within_month">Within a Month</option>
        </Select>

        <Select
          label="Language"
          value={filters.language}
          onChange={(e) => onChange({ language: e.target.value })}
        >
          <option value="">Any Language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="zh">Chinese</option>
        </Select>
      </div>
    </div>
  );
}