import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Document } from '../../types/document';

interface CreateVersionOptions {
  document: Document;
  file: File;
  comment?: string;
  onSuccess?: () => void;
}

export function useCreateVersion() {
  const [isCreating, setIsCreating] = useState(false);
  const { addNotification } = useNotifications();

  const createVersion = async ({ document, file, comment, onSuccess }: CreateVersionOptions) => {
    setIsCreating(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `versions/${document.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

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
          storage_path: filePath,
          size: file.size,
          comment
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
        title: 'Version created',
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
  };

  return {
    createVersion,
    isCreating
  };
}