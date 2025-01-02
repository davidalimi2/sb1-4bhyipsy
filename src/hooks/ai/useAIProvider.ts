import { useState } from 'react';
import { supabase } from '../../lib/supabase';

type AIProvider = 'claude' | 'chatgpt' | 'gemini';

interface UseAIProviderOptions {
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
}

export function useAIProvider(options: UseAIProviderOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: {
          prompt,
          provider: options.provider || 'chatgpt',
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000
        }
      });

      if (error) throw error;
      return data.response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('ai-analyze', {
        body: {
          content,
          provider: options.provider || 'claude'
        }
      });

      if (error) throw error;
      return data.analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI analysis failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    analyzeContent,
    isLoading,
    error
  };
}