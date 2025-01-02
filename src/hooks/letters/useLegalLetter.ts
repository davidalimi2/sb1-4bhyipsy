import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface GenerateLetterOptions {
  caseId: string;
  content: string;
  metadata: Record<string, any>;
}

export function useLegalLetter() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { addNotification } = useNotifications();

  const generateLetter = async ({ caseId, content, metadata }: GenerateLetterOptions) => {
    try {
      setIsGenerating(true);

      // Create document record
      const { data: document, error: createError } = await supabase
        .from('documents')
        .insert({
          case_id: caseId,
          title: `${metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1)} Letter`,
          content,
          type: 'correspondence',
          status: 'draft',
          metadata
        })
        .select()
        .single();

      if (createError) throw createError;

      addNotification({
        type: 'success',
        title: 'Letter generated',
        message: 'Legal letter has been generated successfully'
      });

      return document.id;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate letter'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateLetter,
    isGenerating,
    analysis
  };
}