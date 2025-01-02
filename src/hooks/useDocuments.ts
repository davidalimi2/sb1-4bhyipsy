import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotifications } from './useNotifications';
import { generateStoragePath } from '../utils/storageUtils';
import type { Document } from '../types';

interface UploadDocumentData {
  storage_path: string;
  title: string;
  type: 'filing' | 'evidence' | 'correspondence';
  content?: string;
  caseId?: string;
  mime_type: string;
  size: number;
}

export function useDocuments(caseId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const uploadDocument = async ({
    storage_path,
    title,
    type,
    content,
    caseId,
    mime_type,
    size
  }: UploadDocumentData) => {
    try {
      // Create document record
      const { data: document, error: createError } = await supabase
        .from('documents')
        .insert({
          content,
          title,
          type,
          case_id: caseId,
          storage_path,
          mime_type,
          size,
          status: 'draft'
        })
        .select()
        .single();

      if (createError) throw createError;

      // If document is associated with a case, trigger AI analysis
      if (caseId) {
        await supabase.functions.invoke('analyze-document', {
          body: { documentId: document.id }
        });
      }
      addNotification({
        type: 'success',
        title: 'Document uploaded',
        message: 'Document has been uploaded successfully'
      });

      return document;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: error instanceof Error ? error.message : 'Failed to upload document'
      });
      throw error;
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase
          .from('documents')
          .select(`
            *,
            created_by(full_name),
            comments(count)
          `)
          .order('created_at', { ascending: false });

        // Only filter by case_id if it's provided and not 'all'
        if (caseId && caseId !== 'all') {
          query = query.eq('case_id', caseId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setDocuments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch documents');
        addNotification({
          type: 'error',
          title: 'Error',
          message: err instanceof Error ? err.message : 'Failed to fetch documents'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();

    // Set up real-time subscription
    const subscription = supabase
      .channel('documents')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'documents',
          ...(caseId && caseId !== 'all' ? { filter: `case_id=eq.${caseId}` } : {})
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDocuments(prev => [payload.new as Document, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDocuments(prev => prev.map(d => 
              d.id === payload.new.id ? payload.new as Document : d
            ));
          } else if (payload.eventType === 'DELETE') {
            setDocuments(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId]);

  return {
    documents,
    isLoading,
    error,
    uploadDocument
  };
}