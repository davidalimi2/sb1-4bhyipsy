import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Template } from '../../types/template';

export function useTemplate(templateId: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('templates')
          .select(`
            *,
            versions:template_versions(*)
          `)
          .eq('id', templateId)
          .single();

        if (error) throw error;
        setTemplate(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch template'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, addNotification]);

  return { template, isLoading };
}