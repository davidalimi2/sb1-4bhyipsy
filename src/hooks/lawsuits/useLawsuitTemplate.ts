import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { LawsuitTemplate } from '../../types/lawsuit';

export function useLawsuitTemplate(type?: string) {
  const [template, setTemplate] = useState<LawsuitTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        
        // Get template for the specified type
        const { data, error } = await supabase
          .from('lawsuit_templates')
          .select('*')
          .eq('type', type)
          .single();

        if (error) {
          // If no template exists, create a default one
          if (error.code === 'PGRST116') {
            const defaultTemplate = {
              type,
              title: `Default ${type?.charAt(0).toUpperCase()}${type?.slice(1)} Template`,
              content: '',
              questions: [],
              structure: { elements: [] }
            };

            const { data: newTemplate, error: createError } = await supabase
              .from('lawsuit_templates')
              .insert(defaultTemplate)
              .select()
              .single();

            if (createError) throw createError;
            setTemplate(newTemplate);
          } else {
            throw error;
          }
        } else {
          setTemplate(data);
        }
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

    if (type) {
      fetchTemplate();
    } else {
      setIsLoading(false);
    }
  }, [type, addNotification]);

  return {
    template,
    isLoading
  };
}