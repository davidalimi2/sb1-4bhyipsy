import React from 'react';
import { Select } from '../../../../shared/ui/Select';

interface CitySelectProps {
  cities: string[];
  value: string;
  onChange: (city: string) => void;
  error?: string | null;
}

export function CitySelect({ cities, value, onChange, error }: CitySelectProps) {
  if (cities.length === 0) {
    return null; // Don't show city select for federal courts
  }

  return (
    <Select
      label="City"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      error={error}
    >
      <option value="">Select city</option>
      <option value="all">All Cities</option>
      {cities.map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </Select>
  );
}