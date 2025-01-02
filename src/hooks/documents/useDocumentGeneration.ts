```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { 
  DocumentTemplate, 
  GenerationAnswers, 
  DocumentAnalysis 
} from '../../types/generation';

interface GenerateDocumentOptions {
  templateId: string;
  answers: GenerationAnswers;
  caseId?: string;
}

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const { addNotification } = useNotifications();

  const analyzeAnswers = async (
    templateType: DocumentTemplate['type'],
    answers: GenerationAnswers
  ) => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-document-answers', {
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

  const generateDocument = async ({ 
    templateId, 
    answers,
    caseId 
  }: GenerateDocumentOptions) => {
    try {
      setIsGenerating(true);

      const { data, error } = await supabase.functions.invoke('generate-document', {
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
          status: 'draft'
        })
        .select()
        .single();

      if (createError) throw createError;

      addNotification({
        type: 'success',
        title: 'Document generated',
        message: 'Your document has been generated successfully'
      });

      return document.id;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate document'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDocument,
    analyzeAnswers,
    isGenerating,
    generatedContent,
    analysis
  };
}
```