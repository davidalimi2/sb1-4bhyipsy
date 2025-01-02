```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface DocumentPermissions {
  access: boolean;
  view: boolean;
  comment: boolean;
  upload: boolean;
}

interface LawyerPermissions {
  documents: DocumentPermissions;
  messaging: boolean;
  calendar: boolean;
}

export function usePermissions(lawyerId: string) {
  const [permissions, setPermissions] = useState<LawyerPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('lawyer_permissions')
          .select('*')
          .eq('lawyer_id', lawyerId)
          .eq('client_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setPermissions(data?.permissions || {
          documents: {
            access: false,
            view: false,
            comment: false,
            upload: false
          },
          messaging: false,
          calendar: false
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to load permissions'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [lawyerId, addNotification]);

  const updatePermissions = async (updates: Partial<LawyerPermissions>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('lawyer_permissions')
        .upsert({
          lawyer_id: lawyerId,
          client_id: user.id,
          permissions: {
            ...permissions,
            ...updates
          },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPermissions(prev => prev ? { ...prev, ...updates } : null);
      addNotification({
        type: 'success',
        title: 'Permissions updated',
        message: 'Lawyer permissions have been updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: error instanceof Error ? error.message : 'Failed to update permissions'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permissions,
    isLoading,
    updatePermissions
  };
}
```