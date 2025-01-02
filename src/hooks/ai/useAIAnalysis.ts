import { useState } from 'react';
import { useAIProvider } from './useAIProvider';
import { useNotifications } from '../useNotifications';

interface AIAnalysisOptions {
  type: 'lawsuit' | 'discovery' | 'deposition' | 'motion';
  content: string;
  metadata?: Record<string, any>;
}

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const { analyzeContent, isLoading } = useAIProvider({ provider: 'claude' });
  const { addNotification } = useNotifications();

  const analyze = async (options: AIAnalysisOptions) => {
    try {
      const result = await analyzeContent(options.content);
      setAnalysis(result);
      return result;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze content'
      });
      throw error;
    }
  };

  const getSuggestions = async (analysisId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to fetch suggestions'
      });
      return [];
    }
  };

  return {
    analyze,
    getSuggestions,
    analysis,
    isAnalyzing: isLoading
  };
}