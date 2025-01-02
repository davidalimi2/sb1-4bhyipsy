import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Template } from '../../types/template';

export function useTemplateEditor(initialData?: Partial<Template>) {
  const [template, setTemplate] = useState<Partial<Template>>(initialData || {});
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const updateTemplate = (updates: Partial<Template>) => {
    setTemplate(prev => ({
      ...prev,
      ...updates
    }));
  };

  const saveTemplate = async () => {
    try {
      setIsLoading(true);

      const { data, error } = template.id
        ? await supabase
            .from('templates')
            .update(template)
            .eq('id', template.id)
            .select()
            .single()
        : await supabase
            .from('templates')
            .insert(template)
            .select()
            .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Template saved',
        message: 'Template has been saved successfully'
      });

      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save template'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    template,
    updateTemplate,
    saveTemplate,
    isLoading
  };
}