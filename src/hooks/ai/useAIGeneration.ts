import { useState } from 'react';
import { useAIProvider } from './useAIProvider';
import { useNotifications } from '../useNotifications';

interface GenerationContext {
  type: 'lawsuit' | 'motion' | 'response';
  jurisdiction: string;
  caseType: string;
  parties: {
    plaintiffs: string[];
    defendants: string[];
  };
  facts: string[];
  claims?: string[];
  precedents?: string[];
}

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateResponse } = useAIProvider({ provider: 'chatgpt' });
  const { addNotification } = useNotifications();

  const generateDocument = async (context: GenerationContext) => {
    try {
      setIsGenerating(true);
      
      const response = await generateResponse(JSON.stringify(context));

      addNotification({
        type: 'success',
        title: 'Document generated',
        message: 'Document has been generated successfully'
      });

      return response;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate document'
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const improveDocument = async (content: string, suggestions: string[]) => {
    try {
      setIsGenerating(true);
      
      const response = await generateResponse(JSON.stringify({
        content,
        suggestions
      }));

      return response;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Improvement failed',
        message: error instanceof Error ? error.message : 'Failed to improve document'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateDocument,
    improveDocument,
    isGenerating
  };
}