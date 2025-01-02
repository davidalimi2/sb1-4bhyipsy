import React, { useEffect } from 'react';
import { Lightbulb, AlertCircle } from 'lucide-react';
import { useAIAssistant } from '../../hooks/ai/useAIAssistant';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { Button } from '../shared/ui/Button';

interface AIAssistantProps {
  context: Record<string, any>;
  onSuggestionApply?: (suggestion: any) => void;
}

export function AIAssistant({ context, onSuggestionApply }: AIAssistantProps) {
  const { suggestions, isLoading, generateSuggestions, applySuggestion } = useAIAssistant();

  useEffect(() => {
    generateSuggestions(context);
  }, [context]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-500">
          Analyzing content...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => generateSuggestions(context)}
        >
          Refresh
        </Button>
      </div>

      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            suggestion.priority === 'high' ? 'bg-red-50' :
            suggestion.priority === 'medium' ? 'bg-yellow-50' :
            'bg-blue-50'
          }`}
        >
          <div className="flex items-start">
            {suggestion.priority === 'high' ? (
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            ) : (
              <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <p className={`text-sm ${
                suggestion.priority === 'high' ? 'text-red-800' :
                suggestion.priority === 'medium' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {suggestion.content}
              </p>
              {suggestion.metadata?.details && (
                <p className="mt-1 text-sm text-gray-600">
                  {suggestion.metadata.details}
                </p>
              )}
              {onSuggestionApply && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    onSuggestionApply(suggestion);
                    applySuggestion(suggestion.id);
                  }}
                >
                  Apply Suggestion
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {suggestions.length === 0 && (
        <div className="text-center py-4">
          <Lightbulb className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No suggestions available at this time
          </p>
        </div>
      )}
    </div>
  );
}