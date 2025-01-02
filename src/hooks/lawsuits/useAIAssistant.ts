import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface AIResponse {
  content: string;
  suggestions?: string[];
  nextQuestions?: string[];
}

export function useAIAssistant() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeLawsuit = async (content: string): Promise<AIResponse> => {
    try {
      setIsAnalyzing(true);
      
      // Call Supabase Edge Function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-lawsuit', {
        body: { content }
      });

      if (error) throw error;

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

  const generateSuggestions = async (
    type: 'motion' | 'response' | 'evidence',
    context: Record<string, any>
  ): Promise<string[]> => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: { type, context }
      });

      if (error) throw error;

      return data.suggestions;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to generate suggestions',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeLawsuit,
    generateSuggestions,
    isAnalyzing
  };
}