import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { LawsuitTemplate, LawsuitDraft } from '../../types/lawsuit';

interface UseLawsuitDraftingOptions {
  template?: LawsuitTemplate;
  draft?: LawsuitDraft;
  onComplete?: (draft: LawsuitDraft) => void;
}

export function useLawsuitDrafting({ 
  template, 
  draft,
  onComplete 
}: UseLawsuitDraftingOptions = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(draft?.answers || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const generateContent = (template: LawsuitTemplate, answers: Record<string, any>) => {
    // Replace placeholders in template content with answers
    let content = JSON.parse(JSON.stringify(template.content));
    Object.entries(answers).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = JSON.stringify(content).replace(placeholder, value);
      content = JSON.parse(content);
    });
    return content;
  };

  const saveDraft = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const content = template ? generateContent(template, answers) : draft?.content;
      
      if (!content) throw new Error('No content to save');

      const draftData = {
        user_id: user.id,
        template_id: template?.id || draft?.template_id,
        title: answers.caseTitle || draft?.title,
        content,
        answers,
        jurisdiction: answers.jurisdiction || draft?.jurisdiction,
        status: 'draft' as const
      };

      const { data, error } = draft
        ? await supabase
            .from('lawsuit_drafts')
            .update(draftData)
            .eq('id', draft.id)
            .select()
            .single()
        : await supabase
            .from('lawsuit_drafts')
            .insert(draftData)
            .select()
            .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Draft saved',
        message: 'Your lawsuit draft has been saved successfully'
      });

      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to save draft'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeDraft = async () => {
    try {
      setIsSubmitting(true);
      const savedDraft = await saveDraft();
      
      const { error } = await supabase
        .from('lawsuit_drafts')
        .update({ status: 'final' })
        .eq('id', savedDraft.id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Lawsuit finalized',
        message: 'Your lawsuit has been finalized and is ready to file'
      });

      onComplete?.(savedDraft);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to finalize lawsuit'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    answers,
    handleAnswer,
    saveDraft,
    finalizeDraft,
    isSubmitting
  };
}