import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { supabase } from '../../../lib/supabase';

interface AIAssistantProps {
  content: string;
  onSuggestion: (suggestion: string) => void;
}

export function AIAssistant({ content, onSuggestion }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeLegalContent = async () => {
      if (!content) return;
      
      try {
        setLoading(true);
        
        // Call AI analysis edge function
        const { data, error } = await supabase.functions.invoke('analyze-legal-content', {
          body: { content }
        });

        if (error) throw error;
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error analyzing content:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeLegalContent();
  }, [content]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
          AI Suggestions
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => onSuggestion(suggestion)}
            >
              <p className="text-sm text-gray-600">{suggestion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No suggestions available for the current content
        </p>
      )}
    </div>
  );
}