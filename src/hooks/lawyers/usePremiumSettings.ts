import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface PremiumSettings {
  premiumPlacement: boolean;
  analyticsEnabled: boolean;
  plan: string;
  planDescription: string;
}

export function usePremiumSettings() {
  const [settings, setSettings] = useState<PremiumSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('lawyer_premium_settings')
          .select('*')
          .eq('lawyer_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setSettings(data || {
          premiumPlacement: false,
          analyticsEnabled: false,
          plan: 'Free Plan',
          planDescription: 'Basic features included'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to load settings'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [addNotification]);

  const updateSettings = async (updates: Partial<PremiumSettings>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('lawyer_premium_settings')
        .upsert({
          lawyer_id: user.id,
          ...settings,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      addNotification({
        type: 'success',
        title: 'Settings updated',
        message: 'Your premium settings have been updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: error instanceof Error ? error.message : 'Failed to update settings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call your billing portal endpoint
      const { data, error } = await supabase.functions.invoke('create-billing-portal-session', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Redirect to billing portal URL
      window.location.href = data.url;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to open billing portal'
      });
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    openBillingPortal
  };
}