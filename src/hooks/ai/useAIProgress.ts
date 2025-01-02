```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useAIProgress(caseId: string) {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeCaseProgress = async () => {
    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-case-progress', {
        body: { caseId }
      });

      if (error) throw error;

      // Store analysis results
      const { error: storeError } = await supabase
        .from('case_progress_analysis')
        .upsert({
          case_id: caseId,
          ...data
        });

      if (storeError) throw storeError;

      setAnalysis(data);
      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze case progress'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    analyzeCaseProgress();

    // Subscribe to case changes
    const subscription = supabase
      .channel(`case-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases', filter: `id=eq.${caseId}` },
        () => {
          analyzeCaseProgress();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId]);

  return {
    analysis,
    isAnalyzing,
    refreshAnalysis: analyzeCaseProgress
  };
}
```