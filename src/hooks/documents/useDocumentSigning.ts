import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface SignaturePosition {
  x: number;
  y: number;
  page: number;
  width: number;
  height: number;
}

interface SignDocumentOptions {
  documentId: string;
  signature: string;
  position: SignaturePosition;
}

export function useDocumentSigning() {
  const [isSigning, setIsSigning] = useState(false);
  const { addNotification } = useNotifications();

  const signDocument = async ({ documentId, signature, position }: SignDocumentOptions) => {
    try {
      setIsSigning(true);

      // Get original document
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // Create new version with signature
      const { data: version, error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          storage_path: document.storage_path,
          signature_data: {
            signature,
            position,
            timestamp: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update document status
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: 'signed',
          current_version_id: version.id
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      addNotification({
        type: 'success',
        title: 'Document signed',
        message: 'Document has been signed successfully'
      });

      return version;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Signing failed',
        message: error instanceof Error ? error.message : 'Failed to sign document'
      });
      throw error;
    } finally {
      setIsSigning(false);
    }
  };

  return {
    signDocument,
    isSigning
  };
}