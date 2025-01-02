import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface NextAction {
  type: 'motion' | 'discovery' | 'brief' | 'response';
  title: string;
  description: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  citations?: string[];
  explanation?: string;
  context: Record<string, any>;
}

export function useNextBestActions(caseId: string) {
  const [actions, setActions] = useState<NextAction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setIsLoading(true);

        // Get case details and context
        const { data: caseData, error: caseError } = await supabase
          .from('cases')
          .select(`
            *,
            documents(count),
            discovery(count)
          `)
          .eq('id', caseId)
          .single();

        if (caseError) throw caseError;

        // Get AI analysis and recommendations
        const { data: analysis, error: aiError } = await supabase.functions.invoke('analyze-next-actions', {
          body: { caseId, caseData }
        });

        if (aiError) throw aiError;

        setActions(analysis.actions);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch next actions'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();

    // Subscribe to case changes
    const subscription = supabase
      .channel(`case-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cases', filter: `id=eq.${caseId}` },
        () => {
          fetchActions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, addNotification]);

  const generateAction = async (type: NextAction['type'], context: Record<string, any>) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('generate-legal-document', {
        body: { type, context, caseId }
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Document generated',
        message: 'Legal document has been generated successfully'
      });

      return data.documentId;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate document'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    actions,
    isLoading,
    generateAction
  };
}