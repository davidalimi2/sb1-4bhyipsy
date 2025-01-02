import React from 'react';
import { StateSelect } from './StateSelect';
import { CitySelect } from './CitySelect';
import { CourtSelect } from './CourtSelect';
import { CourtBranchSelect } from './CourtBranchSelect';
import { useCourts } from './useCourts';

interface CourtSelectionProps {
  formData: any;
  onChange: (data: any) => void;
}

export function CourtSelection({ formData, onChange }: CourtSelectionProps) {
  const {
    cities,
    courts,
    courtBranches,
    error,
    handleStateChange,
    handleCityChange,
    handleCourtChange
  } = useCourts(formData, onChange);

  // Only show city select for state courts
  const showCitySelect = formData.state && 
    !formData.state.startsWith('fed_') && 
    !formData.state.startsWith('ussc') &&
    cities.length > 0;
  return (
    <div className="space-y-4">
      <StateSelect
        value={formData.state || ''} 
        onChange={handleStateChange}
      />

      {showCitySelect && (
        <CitySelect
          cities={cities}
          value={formData.city || ''}
          onChange={handleCityChange}
          error={error}
        />
      )}

      {formData.state && (
        <CourtSelect
          courts={courts}
          value={formData.jurisdiction || ''}
          onChange={handleCourtChange}
          error={error}
        />
      )}

      {formData.jurisdiction && courtBranches.length > 0 && (
        <CourtBranchSelect
          branches={courtBranches}
          value={formData.courtBranch || ''}
          onChange={(e) => onChange({ ...formData, courtBranch: e.target.value })}
          error={error}
        />
      )}
    </div>
  );
}