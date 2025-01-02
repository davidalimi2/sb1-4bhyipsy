import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { generateStoragePath } from '../../utils/storageUtils';
import type { Document, DocumentVersion } from '../../types/document';

interface UseVersionManagementOptions {
  document: Document;
  onSuccess?: () => void;
}

export function useVersionManagement({ document, onSuccess }: UseVersionManagementOptions) {
  const [isCreating, setIsCreating] = useState(false);
  const { addNotification } = useNotifications();

  const createVersion = useCallback(async (file: File, comment?: string) => {
    try {
      setIsCreating(true);

      // Upload file
      const path = generateStoragePath(`versions/${document.id}`, file.name);
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Get next version number
      const { data: versions } = await supabase
        .from('document_versions')
        .select('version')
        .eq('document_id', document.id)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = (versions?.[0]?.version || 0) + 1;

      // Create version record
      const { data: version, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: document.id,
          version: nextVersion,
          storage_path: path,
          size: file.size,
          comment,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update document's current version
      const { error: updateError } = await supabase
        .from('documents')
        .update({ current_version_id: version.id })
        .eq('id', document.id);

      if (updateError) throw updateError;

      addNotification({
        type: 'success',
        title: 'Version Created',
        message: 'New document version has been created successfully'
      });

      onSuccess?.();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create version'
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [document.id, addNotification, onSuccess]);

  const restoreVersion = useCallback(async (versionId: string) => {
    try {
      const { error } = await supabase.rpc('restore_document_version', {
        version_id: versionId
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Version Restored',
        message: 'Document version has been restored successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to restore version'
      });
      throw error;
    }
  }, [addNotification]);

  return {
    createVersion,
    restoreVersion,
    isCreating
  };
}