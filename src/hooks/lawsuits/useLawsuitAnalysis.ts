import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { generateStoragePath } from '../../utils/storageUtils';
import type { LawsuitAnalysis } from '../../types/lawsuit';

export function useLawsuitAnalysis() {
  const [analysis, setAnalysis] = useState<LawsuitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeLawsuit = async (file: File, citationFiles: File[] = []) => {
    try {
      setIsAnalyzing(true);
      setAnalysis(null);

      // Upload complaint file
      const path = generateStoragePath(`analysis/${file.name}`, file.name);
      const { error: uploadError } = await supabase.storage
        .from('lawsuits')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Upload citation files
      const citationPaths = await Promise.all(
        citationFiles.map(async (citationFile) => {
          const citationPath = generateStoragePath(`citations/${citationFile.name}`, citationFile.name);
          const { error } = await supabase.storage
            .from('lawsuits')
            .upload(citationPath, citationFile);

          if (error) throw error;
          return citationPath;
        })
      );

      // Get analysis from Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-lawsuit', {
        body: { 
          path,
          citationPaths
        }
      });

      if (error) throw error;

      setAnalysis(data);
      addNotification({
        type: 'success',
        title: 'Analysis complete',
        message: 'Lawsuit has been analyzed successfully'
      });

      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze lawsuit'
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateResponse = async (analysisId: string) => {
    try {
      setIsAnalyzing(true);

      const { data, error } = await supabase.functions.invoke('generate-lawsuit-response', {
        body: { analysisId }
      });

      if (error) throw error;

      return data.documentId;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate response'
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analysis,
    isAnalyzing,
    analyzeLawsuit,
    generateResponse
  };
}