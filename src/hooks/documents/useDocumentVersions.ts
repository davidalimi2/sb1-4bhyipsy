import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { DocumentVersion } from '../../types/document';

export function useDocumentVersions(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    async function fetchVersions() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('document_versions')
          .select('*')
          .eq('document_id', documentId)
          .order('version', { ascending: false });

        if (error) throw error;
        setVersions(data || []);
      } catch (error) {
        console.error('Error fetching versions:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load document versions'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchVersions();
  }, [documentId, addNotification]);

  const restoreVersion = useCallback(async (versionId: string) => {
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
        message: 'Failed to restore document version'
      });
    }
  }, [addNotification]);

  return {
    versions,
    isLoading,
    restoreVersion
  };
}