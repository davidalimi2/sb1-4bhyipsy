import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Case } from '../types';

export function useCase(caseId: string) {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('cases')
          .select(`
            *,
            client:client_id(full_name),
            lawyer:lawyer_id(full_name),
            documents(count),
            tasks(count)
          `)
          .eq('id', caseId)
          .single();

        if (fetchError) throw fetchError;
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch case');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`case-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases', filter: `id=eq.${caseId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setCaseData(payload.new as Case);
          } else if (payload.eventType === 'DELETE') {
            setCaseData(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId]);

  const updateCase = async (updates: Partial<Case>) => {
    try {
      const { error: updateError } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', caseId);

      if (updateError) throw updateError;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update case');
    }
  };

  const deleteCase = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('cases')
        .delete()
        .eq('id', caseId);

      if (deleteError) throw deleteError;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete case');
    }
  };

  return {
    caseData,
    isLoading,
    error,
    updateCase,
    deleteCase
  };
}