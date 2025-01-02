import React from 'react';
import { Select } from '../../../../shared/ui/Select';

interface CourtSelectProps {
  courts: string[];
  value: string;
  onChange: (court: string) => void;
  error?: string | null;
}

export function CourtSelect({ courts, value, onChange, error }: CourtSelectProps) {
  return (
    <Select
      label="Court"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      error={error}
    >
      <option value="">Select court</option>
      {courts.map(court => (
        <option key={court} value={court}>{court}</option>
      ))}
    </Select>
  );
}