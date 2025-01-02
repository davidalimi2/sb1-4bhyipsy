import { useState, useCallback } from 'react';
import { getSignedUrl } from '../../utils/storageUtils';
import { useNotifications } from '../useNotifications';
import type { Document, DocumentVersion } from '../../types/document';

interface PreviewState {
  document: Document | null;
  version: DocumentVersion | null;
  url: string | null;
}

export function useDocumentPreview() {
  const [state, setState] = useState<PreviewState>({
    document: null,
    version: null,
    url: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const openPreview = useCallback(async (doc: Document, version?: DocumentVersion) => {
    try {
      setIsLoading(true);
      setError(null);

      const path = version?.storage_path || doc.storage_path;
      const signedUrl = await getSignedUrl(path);

      setState({
        document: doc,
        version: version || null,
        url: signedUrl
      });
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
    setState({ document: null, version: null, url: null });
    setError(null);
  }, []);

  return {
    ...state,
    isLoading,
    error,
    openPreview,
    closePreview
  };
}