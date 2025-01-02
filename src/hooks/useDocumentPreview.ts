import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useNotifications } from './useNotifications';
import type { Document } from '../types/document';

export function useDocumentPreview() {
  const [document, setDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const openPreview = useCallback(async (doc: Document) => {
    try {
      setIsLoading(true);
      setDocument(doc);

      const { data: { publicUrl }, error } = supabase.storage
        .from('documents')
        .getPublicUrl(doc.storage_path);

      if (error) throw error;
      setPreviewUrl(publicUrl);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Preview Error',
        message: error instanceof Error ? error.message : 'Failed to load preview'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const closePreview = useCallback(() => {
    setDocument(null);
    setPreviewUrl(null);
  }, []);

  return {
    document,
    previewUrl,
    isLoading,
    openPreview,
    closePreview
  };
}