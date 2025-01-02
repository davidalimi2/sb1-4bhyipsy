import { useState, useCallback } from 'react';
import { getSignedUrl } from '../../utils/storageUtils';
import { useNotifications } from '../useNotifications';
import type { Document } from '../../types/document';

export function usePreview() {
  const [document, setDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const openPreview = useCallback(async (doc: Document) => {
    try {
      setIsLoading(true);
      setError(null);
      setDocument(doc);

      const signedUrl = await getSignedUrl(doc.storage_path);
      setPreviewUrl(signedUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preview';
      setError(message);
      addNotification({
        type: 'error',
        title: 'Preview Error',
        message
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const closePreview = useCallback(() => {
    setDocument(null);
    setPreviewUrl(null);
    setError(null);
  }, []);

  return {
    document,
    previewUrl,
    isLoading,
    error,
    openPreview,
    closePreview
  };
}