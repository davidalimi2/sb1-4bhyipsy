import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { LawsuitDraft } from '../../types/lawsuit';

export function useLawsuitDraft(caseId: string) {
  const [draft, setDraft] = useState<LawsuitDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setIsLoading(true);
        
        // Get latest draft for this case
        const { data, error } = await supabase
          .from('lawsuit_drafts')
          .select('*')
          .eq('case_id', caseId)
          .eq('status', 'draft')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        setDraft(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch draft'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (caseId) {
      fetchDraft();
    }
  }, [caseId, addNotification]);

  const saveDraft = async (data: Partial<LawsuitDraft>) => {
    try {
      const { error } = await supabase
        .from('lawsuit_drafts')
        .upsert({
          ...data,
          case_id: caseId,
          status: 'draft',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Draft saved',
        message: 'Your draft has been saved successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save draft'
      });
      throw error;
    }
  };

  return {
    draft,
    isLoading,
    saveDraft
  };
}