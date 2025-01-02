```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Template } from '../../types/template';

interface AISuggestion {
  text: string;
  type: 'content' | 'structure' | 'question';
  data?: any;
}

export function useAIAssistant() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeTemplate = async (template: Partial<Template>) => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-template', {
        body: { template }
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      setWarnings(data.warnings || []);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze template'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSuggestions = async (context: {
    type: 'content' | 'structure' | 'question';
    data: any;
  }) => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('generate-suggestions', {
        body: { context }
      });

      if (error) throw error;

      return data.suggestions;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate suggestions'
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    suggestions,
    warnings,
    isAnalyzing,
    analyzeTemplate,
    generateSuggestions
  };
}
```