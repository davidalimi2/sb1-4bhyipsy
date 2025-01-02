```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { convertHtmlToPdf } from '../../utils/pdfUtils';

export function useDocumentEditor(documentId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { addNotification } = useNotifications();

  const saveDocument = async (content: string) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('documents')
        .update({ content })
        .eq('id', documentId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Document saved',
        message: 'Your changes have been saved successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save failed',
        message: error instanceof Error ? error.message : 'Failed to save document'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const convertToPdf = async (content: string): Promise<string | null> => {
    try {
      setIsConverting(true);
      
      // Convert HTML content to PDF
      const pdfBlob = await convertHtmlToPdf(content);
      
      // Upload PDF to storage
      const filename = `${documentId}-${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`pdfs/${filename}`, pdfBlob);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`pdfs/${filename}`);

      return publicUrl;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Conversion failed',
        message: error instanceof Error ? error.message : 'Failed to convert to PDF'
      });
      return null;
    } finally {
      setIsConverting(false);
    }
  };

  return {
    saveDocument,
    convertToPdf,
    isSaving,
    isConverting
  };
}
```