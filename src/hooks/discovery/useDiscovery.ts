import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Discovery } from '../../types/discovery';

export function useDiscovery(caseId: string) {
  const [discovery, setDiscovery] = useState<Discovery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('discovery')
          .select(`
            *,
            responses:discovery_responses(*)
          `)
          .eq('case_id', caseId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDiscovery(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch discovery'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscovery();

    // Subscribe to changes
    const subscription = supabase
      .channel(`discovery-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'discovery', filter: `case_id=eq.${caseId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDiscovery(prev => [payload.new as Discovery, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDiscovery(prev => prev.map(d => 
              d.id === payload.new.id ? payload.new as Discovery : d
            ));
          } else if (payload.eventType === 'DELETE') {
            setDiscovery(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, addNotification]);

  return { discovery, isLoading };
}