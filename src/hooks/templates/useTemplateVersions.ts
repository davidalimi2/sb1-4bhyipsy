```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { TemplateVersion } from '../../types/template';

export function useTemplateVersions(templateId: string) {
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('template_versions')
          .select(`
            *,
            created_by:users(full_name)
          `)
          .eq('template_id', templateId)
          .order('version', { ascending: false });

        if (error) throw error;
        setVersions(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch versions'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();

    // Subscribe to version changes
    const subscription = supabase
      .channel(`template-versions-${templateId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'template_versions', filter: `template_id=eq.${templateId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVersions(prev => [payload.new as TemplateVersion, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [templateId, addNotification]);

  const restoreVersion = async (versionId: string) => {
    try {
      const { error } = await supabase.rpc('restore_template_version', {
        version_id: versionId
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Version restored',
        message: 'Template version has been restored successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to restore version'
      });
      throw error;
    }
  };

  return {
    versions,
    isLoading,
    restoreVersion
  };
}
```