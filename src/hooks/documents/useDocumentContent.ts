import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Document, DocumentVersion } from '../../types/document';

export function useDocumentContent(document: Document, version?: DocumentVersion) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setIsLoading(true);
        setError(null);

        const path = version?.storage_path || document.storage_path;
        const { data, error: downloadError } = await supabase.storage
          .from('documents')
          .download(path);

        if (downloadError) throw downloadError;

        const url = URL.createObjectURL(data);
        setContent(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();

    return () => {
      if (content) {
        URL.revokeObjectURL(content);
      }
    };
  }, [document.id, version?.id]);

  return { content, isLoading, error };
}