import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Rule } from '../../types/message';

export function useMessageRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('message_rules')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRules(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch rules'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, [addNotification]);

  const updateRule = async (id: string, updates: Partial<Rule>) => {
    try {
      const { error } = await supabase
        .from('message_rules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRules(prev => prev.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      ));

      addNotification({
        type: 'success',
        title: 'Rule updated',
        message: 'Rule has been updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update rule'
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('message_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(prev => prev.filter(rule => rule.id !== id));

      addNotification({
        type: 'success',
        title: 'Rule deleted',
        message: 'Rule has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete rule'
      });
    }
  };

  return {
    rules,
    isLoading,
    updateRule,
    deleteRule
  };
}