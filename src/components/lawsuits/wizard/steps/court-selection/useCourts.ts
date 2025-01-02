import { useState, useCallback } from 'react';
import { getStateCourts, getCourtBranches, getStateCities } from '../../../../../utils/courts';

interface FormData {
  state?: string;
  city?: string;
  jurisdiction?: string;
  courtBranch?: string;
}

interface UseCourtsResult {
  cities: string[];
  courts: string[];
  courtBranches: string[];
  error: string | null;
  handleStateChange: (state: string) => void;
  handleCityChange: (city: string) => void;
  handleCourtChange: (court: string) => void;
}

export function useCourts(formData: FormData, onChange: (data: Partial<FormData>) => void): UseCourtsResult {
  const [cities, setCities] = useState<string[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [courtBranches, setCourtBranches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = useCallback((state: string) => {
    setError(null);
    
    // Reset all dependent fields
    onChange({
      state,
      city: '',
      jurisdiction: '',
      courtBranch: ''
    });
    
    // Get available cities and courts for selected state
    const stateCities = getStateCities(state);
    const stateCourts = getStateCourts(state);
    
    setCities(stateCities);
    setCourts(stateCourts);
    setCourtBranches([]);
  }, [onChange]);

  const handleCityChange = useCallback((city: string) => {
    setError(null);
    onChange({ city, jurisdiction: '', courtBranch: '' });
    setCourtBranches([]);
  }, [onChange]);

  const handleCourtChange = useCallback((court: string) => {
    setError(null);
    onChange({ jurisdiction: court, courtBranch: '' });

    // Get available branches for selected court
    if (formData.state && court) {
      const branches = getCourtBranches(formData.state, court, formData.city);
      setCourtBranches(branches);
    } else {
      setCourtBranches([]);
    }
  }, [formData.state, formData.city, onChange]);

  return {
    cities,
    courts,
    courtBranches,
    error,
    handleStateChange,
    handleCityChange,
    handleCourtChange
  };
}