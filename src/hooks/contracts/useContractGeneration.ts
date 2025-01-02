import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface GenerateContractOptions {
  caseId: string;
  content: string;
  metadata: Record<string, any>;
}

export function useContractGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { addNotification } = useNotifications();

  const generateContract = async ({ caseId, content, metadata }: GenerateContractOptions) => {
    try {
      setIsGenerating(true);

      // Create document record
      const { data: document, error: createError } = await supabase
        .from('documents')
        .insert({
          case_id: caseId,
          title: metadata.parties.title || 'Contract',
          content,
          type: 'filing',
          status: 'draft',
          metadata
        })
        .select()
        .single();

      if (createError) throw createError;

      addNotification({
        type: 'success',
        title: 'Contract generated',
        message: 'Contract has been generated successfully'
      });

      return document.id;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate contract'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContract,
    isGenerating,
    analysis
  };
}