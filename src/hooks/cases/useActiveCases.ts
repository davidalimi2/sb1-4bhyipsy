import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Case } from '../../types/case';

export function useActiveCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('cases')
          .select(`
            *,
            client:client_id(full_name),
            lawyer:lawyer_id(full_name)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCases(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch cases'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();

    // Subscribe to case changes
    const subscription = supabase
      .channel('active-cases')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases' },
        () => {
          fetchCases();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [addNotification]);

  return { cases, isLoading };
}