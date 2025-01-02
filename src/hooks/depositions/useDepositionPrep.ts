import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Question } from '../../types/deposition';

interface GenerateQuestionsOptions {
  caseType: string;
  deponentRole: string;
  keyIssues: string[];
}

interface SavePlanOptions {
  caseId: string;
  deponentName: string;
  date?: string;
  questions: Question[];
  objectives: string[];
  documents: string[];
  notes: string;
}

export function useDepositionPrep(caseId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const generateQuestions = async (options: GenerateQuestionsOptions): Promise<Question[]> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-deposition-questions', {
        body: options
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Questions generated',
        message: 'Deposition questions have been generated successfully'
      });

      return data.questions;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate questions'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const savePlan = async (data: SavePlanOptions) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('deposition_plans')
        .insert({
          case_id: caseId,
          deponent_name: data.deponentName,
          date: data.date,
          questions: data.questions,
          objectives: data.objectives,
          documents: data.documents,
          notes: data.notes,
          status: 'draft'
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Plan saved',
        message: 'Deposition plan has been saved successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save failed',
        message: error instanceof Error ? error.message : 'Failed to save plan'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateQuestions,
    savePlan,
    isLoading
  };
}