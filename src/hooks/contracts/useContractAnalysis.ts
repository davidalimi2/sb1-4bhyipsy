import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useContractAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeContract = async (file: File, caseId: string) => {
    try {
      setIsAnalyzing(true);

      // Upload file
      const path = `contracts/${caseId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Get analysis from Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-contract', {
        body: { path, caseId }
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Analysis complete',
        message: 'Contract has been analyzed successfully'
      });

      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze contract'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeContract,
    isAnalyzing
  };
}