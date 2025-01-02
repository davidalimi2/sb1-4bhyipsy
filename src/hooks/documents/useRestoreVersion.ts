import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useRestoreVersion() {
  const [isRestoring, setIsRestoring] = useState(false);
  const { addNotification } = useNotifications();

  const restoreVersion = async (versionId: string) => {
    setIsRestoring(true);
    try {
      const { error } = await supabase.rpc('restore_document_version', {
        version_id: versionId
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Version restored',
        message: 'Document version has been restored successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to restore version'
      });
      throw error;
    } finally {
      setIsRestoring(false);
    }
  };

  return {
    restoreVersion,
    isRestoring
  };
}