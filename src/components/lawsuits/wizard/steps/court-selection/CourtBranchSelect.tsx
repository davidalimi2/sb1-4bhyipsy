import React from 'react';
import { Select } from '../../../../shared/ui/Select';

interface CourtBranchSelectProps {
  branches: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string | null;
}

export function CourtBranchSelect({ branches, value, onChange, error }: CourtBranchSelectProps) {
  if (!branches.length) {
    return null;
  }

  return (
    <Select
      label="Court Branch"
      value={value}
      onChange={onChange}
      required
      error={error}
    >
      <option value="">Select court branch</option>
      {branches.map(branch => (
        <option key={branch} value={branch}>{branch}</option>
      ))}
    </Select>
  );
}