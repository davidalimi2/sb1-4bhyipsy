import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface AISuggestion {
  type: 'action' | 'document' | 'question' | 'citation';
  content: string;
  priority: 'high' | 'medium' | 'low';
  metadata?: Record<string, any>;
}

export function useAIAssistant() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const generateSuggestions = async (context: Record<string, any>) => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-legal-content', {
        body: { context }
      });

      if (error || !data) {
        throw error || new Error('Failed to analyze content. Please try again.');
      }

      setSuggestions(data.suggestions || []);
      return data.suggestions || [];
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unable to analyze content. Please try again.'
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    suggestions,
    isAnalyzing,
    generateSuggestions
  };
}