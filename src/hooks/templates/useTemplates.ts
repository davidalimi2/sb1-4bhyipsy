import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Template } from '../../types/template';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('templates')
          .select(`
            *,
            versions:template_versions(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch templates'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();

    // Subscribe to template changes
    const subscription = supabase
      .channel('templates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'templates' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTemplates(prev => [payload.new as Template, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTemplates(prev => prev.map(t => 
              t.id === payload.new.id ? payload.new as Template : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTemplates(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [addNotification]);

  return { templates, isLoading };
}