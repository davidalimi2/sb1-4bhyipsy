```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useAIAssistant() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeLegalContext = async (context: Record<string, any>) => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-legal-context', {
        body: { context }
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      setWarnings(data.warnings || []);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze context'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeLegalContext,
    suggestions,
    warnings,
    isAnalyzing
  };
}
```