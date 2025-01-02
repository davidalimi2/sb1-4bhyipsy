```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface QuestionContext {
  type: 'deposition' | 'interrogatory';
  caseType: string;
  deponentRole?: string;
  keyIssues: string[];
  existingAnswers?: Record<string, any>;
}

export function useAIQuestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { addNotification } = useNotifications();

  const generateQuestions = async (context: QuestionContext) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-legal-questions', {
        body: { context }
      });

      if (error) throw error;

      return data.questions;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate questions'
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeAnswers = async (questions: any[], answers: Record<string, any>) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-question-answers', {
        body: { questions, answers }
      });

      if (error) throw error;

      return data.analysis;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze answers'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestFollowUp = async (question: string, answer: string) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('suggest-followup-questions', {
        body: { question, answer }
      });

      if (error) throw error;

      return data.suggestions;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Suggestion failed',
        message: error instanceof Error ? error.message : 'Failed to suggest follow-up questions'
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuestions,
    analyzeAnswers,
    suggestFollowUp,
    isGenerating
  };
}
```