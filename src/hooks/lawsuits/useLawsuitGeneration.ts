import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { LawsuitTemplate } from '../../types/lawsuit';

interface GenerateLawsuitOptions {
  templateId: string;
  answers: Record<string, any>;
  caseId?: string;
}

export function useLawsuitGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const { addNotification } = useNotifications();

  const analyzeAnswers = async (
    templateType: LawsuitTemplate['type'],
    answers: Record<string, any>
  ) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-lawsuit-answers', {
        body: { templateType, answers }
      });

      if (error) throw error;
      setAnalysis(data);
      
      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze answers'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLawsuit = async ({ 
    templateId, 
    answers,
    caseId 
  }: GenerateLawsuitOptions) => {
    try {
      setIsGenerating(true);

      const { data, error } = await supabase.functions.invoke('generate-lawsuit', {
        body: { templateId, answers, caseId }
      });

      if (error) throw error;
      
      setGeneratedContent(data.content);
      
      // Create document record
      const { data: document, error: createError } = await supabase
        .from('documents')
        .insert({
          title: data.title,
          content: data.content,
          case_id: caseId,
          template_id: templateId,
          status: 'draft',
          type: 'filing'
        })
        .select()
        .single();

      if (createError) throw createError;

      addNotification({
        type: 'success',
        title: 'Lawsuit generated',
        message: 'Your lawsuit has been generated successfully'
      });

      return document.id;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate lawsuit'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateLawsuit,
    analyzeAnswers,
    isGenerating,
    generatedContent,
    analysis
  };
}