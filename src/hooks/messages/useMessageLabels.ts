import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { MessageLabel } from '../../types/message';

export function useMessageLabels() {
  const [labels, setLabels] = useState<MessageLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('message_labels')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (error) throw error;
        setLabels(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch labels'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabels();
  }, [addNotification]);

  const createLabel = async (name: string, color: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('message_labels')
        .insert({
          user_id: user.id,
          name,
          color
        })
        .select()
        .single();

      if (error) throw error;

      setLabels(prev => [...prev, data]);

      addNotification({
        type: 'success',
        title: 'Label created',
        message: 'New label has been created successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create label'
      });
    }
  };

  const deleteLabel = async (labelId: string) => {
    try {
      const { error } = await supabase
        .from('message_labels')
        .delete()
        .eq('id', labelId);

      if (error) throw error;

      setLabels(prev => prev.filter(l => l.id !== labelId));

      addNotification({
        type: 'success',
        title: 'Label deleted',
        message: 'Label has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete label'
      });
    }
  };

  return {
    labels,
    isLoading,
    createLabel,
    deleteLabel
  };
}