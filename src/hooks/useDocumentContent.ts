import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Document } from '../types/document';

export function useDocumentContent(document: Document) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setIsLoading(true);
        setError(null);

        // Get public URL instead of downloading
        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('documents')
          .getPublicUrl(document.storage_path);

        if (urlError) throw urlError;
        
        setContent(publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [document.storage_path]);

  return { content, isLoading, error };
}