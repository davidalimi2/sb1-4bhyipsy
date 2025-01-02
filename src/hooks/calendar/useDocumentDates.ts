import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { CalendarEvent } from '../../types/calendar';

export function useDocumentDates() {
  const [isScanning, setIsScanning] = useState(false);
  const { addNotification } = useNotifications();

  const scanDocument = async (documentId: string): Promise<CalendarEvent[]> => {
    try {
      setIsScanning(true);

      // Get document content
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // Extract dates using AI
      const { data: dates, error: aiError } = await supabase.functions.invoke('extract-document-dates', {
        body: { documentId, content: document.content }
      });

      if (aiError) throw aiError;

      addNotification({
        type: 'success',
        title: 'Dates extracted',
        message: 'Critical dates have been extracted from the document'
      });

      return dates;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Extraction failed',
        message: error instanceof Error ? error.message : 'Failed to extract dates'
      });
      return [];
    } finally {
      setIsScanning(false);
    }
  };

  return {
    scanDocument,
    isScanning
  };
}