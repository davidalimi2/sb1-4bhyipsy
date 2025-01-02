import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Case } from '../types';

export function useActiveCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('cases')
          .select(`
            *,
            client:client_id(full_name),
            lawyer:lawyer_id(full_name)
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setCases(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cases');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('cases')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases' },
        (payload) => {
          // Update cases list based on the change
          if (payload.eventType === 'INSERT') {
            setCases(prev => [payload.new as Case, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCases(prev => prev.map(c => 
              c.id === payload.new.id ? payload.new as Case : c
            ));
          } else if (payload.eventType === 'DELETE') {
            setCases(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { cases, isLoading, error };
}