import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface CaseProgressAnalysis {
  status_summary: string;
  completion_percentage: number;
  suggested_actions: Array<{
    title: string;
    description: string;
    deadline?: string;
    url?: string;
  }>;
  risk_factors: Array<{
    factor: string;
    mitigation: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  next_deadlines: Array<{
    date: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  required_documents: Array<{
    title: string;
    description: string;
    template_url?: string;
  }>;
}

export function useCaseProgress(caseId: string) {
  const [analysis, setAnalysis] = useState<CaseProgressAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  const fetchAnalysis = async () => {
    try {
      setIsLoading(true);
      setAnalysis(null);

      // Get case progress analysis
      const { data: progressData, error: progressError } = await supabase
        .from('case_progress_analysis')
        .select('*')
        .eq('case_id', caseId);

      if (progressError) throw progressError;

      if (!progressData?.length) {
        // Initialize analysis if none exists
        const { data: newAnalysis, error: initError } = await supabase
          .rpc('initialize_case_progress_analysis', { case_id: caseId });

        if (initError) throw initError;
        setAnalysis(newAnalysis);
      } else {
        // Get latest AI analysis
        const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-case-progress', {
          body: { caseId }
        });

        if (aiError) throw aiError;

        // Merge existing analysis with AI suggestions
        setAnalysis({
          ...progressData[0],
          ...aiData
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze case progress'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();

    // Subscribe to case changes
    const subscription = supabase
      .channel(`case_progress_${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases', filter: `id=eq.${caseId}` },
        () => {
          fetchAnalysis();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, addNotification]);

  const refreshAnalysis = () => {
    fetchAnalysis();
  };

  return {
    analysis,
    isLoading,
    refreshAnalysis
  };
}