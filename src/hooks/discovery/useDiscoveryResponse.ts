import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { generateStoragePath, uploadFile } from '../../utils/storageUtils';
import { validateResponse } from '../../utils/discoveryUtils';

interface ResponseData {
  content: string;
  documents: File[];
}

export function useDiscoveryResponse(discoveryId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const submitResponse = async (data: ResponseData) => {
    try {
      setIsSubmitting(true);

      // Validate response data
      const validation = validateResponse(data.content, data.documents);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Upload documents
      const documentIds = await Promise.all(
        data.documents.map(async (file) => {
          const path = generateStoragePath('discovery-responses', discoveryId + '-' + file.name);
          await uploadFile(file, path);
          
          const { data: doc, error } = await supabase
            .from('documents')
            .insert({
              title: file.name,
              storage_path: path,
              type: 'discovery',
              size: file.size
            })
            .select()
            .single();

          if (error) throw error;
          return doc.id;
        })
      );

      // Create response record
      const { error: responseError } = await supabase
        .from('discovery_responses')
        .insert({
          discovery_id: discoveryId,
          content: data.content,
          documents: documentIds
        });

      if (responseError) throw responseError;

      // Update discovery status
      const { error: updateError } = await supabase
        .from('discovery')
        .update({ status: 'completed' })
        .eq('id', discoveryId);

      if (updateError) throw updateError;

      addNotification({
        type: 'success',
        title: 'Response submitted',
        message: 'Your discovery response has been submitted successfully'
      });

      navigate('/discovery/' + discoveryId);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit response'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitResponse,
    isSubmitting
  };
}