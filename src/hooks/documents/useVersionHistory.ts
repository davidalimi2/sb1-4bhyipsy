import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { DocumentVersion } from '../../types/document';

export function useVersionHistory(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('document_versions')
          .select('*')
          .eq('document_id', documentId)
          .order('version', { ascending: false });

        if (error) throw error;
        setVersions(data);
      } catch (error) {
        console.error('Error fetching version history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();

    // Subscribe to version changes
    const subscription = supabase
      .channel(`versions-${documentId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'document_versions',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVersions(prev => [payload.new as DocumentVersion, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  return { versions, isLoading };
}