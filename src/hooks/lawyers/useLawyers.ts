import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Lawyer, LawyerFilters } from '../../types/lawyer';

export function useLawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LawyerFilters>({});
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('lawyers')
          .select(`
            *,
            education:lawyer_education(*),
            certifications:lawyer_certifications(*)
          `);

        // Apply filters
        if (filters.practiceArea) {
          query = query.contains('practice_areas', [filters.practiceArea]);
        }

        if (filters.experienceLevel) {
          const years = {
            junior: [1, 5],
            mid: [5, 10],
            senior: [10, 100]
          }[filters.experienceLevel];
          
          if (years) {
            query = query
              .gte('years_experience', years[0])
              .lt('years_experience', years[1]);
          }
        }

        if (filters.maxRate) {
          query = query.lte('hourly_rate', filters.maxRate);
        }

        if (filters.minRating) {
          query = query.gte('rating', parseFloat(filters.minRating));
        }

        if (filters.availability) {
          query = query.eq('availability', filters.availability);
        }

        if (filters.language) {
          query = query.contains('languages', [filters.language]);
        }

        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setLawyers(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch lawyers'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, [filters, addNotification]);

  const updateFilters = (newFilters: Partial<LawyerFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    lawyers,
    isLoading,
    filters,
    updateFilters
  };
}