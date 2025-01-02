import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Discovery } from '../../types/discovery';

export function useDiscoveryDetails(discoveryId: string) {
  const [discovery, setDiscovery] = useState<Discovery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('discovery')
          .select(`
            id,
            case_id,
            type,
            description,
            party,
            status,
            due_date,
            created_at,
            updated_at,
            responses (
              id,
              content,
              documents,
              created_at,
              created_by (
                id,
                full_name
              )
            )
          `)
          .eq('id', discoveryId)
          .single();

        if (error) throw error;
        setDiscovery(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch discovery details'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`discovery-${discoveryId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'discovery', filter: `id=eq.${discoveryId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setDiscovery(prev => prev ? { ...prev, ...payload.new } : null);
          } else if (payload.eventType === 'DELETE') {
            setDiscovery(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [discoveryId, addNotification]);

  return { discovery, isLoading };
}