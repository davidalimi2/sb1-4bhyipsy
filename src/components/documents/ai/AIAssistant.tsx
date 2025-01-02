```typescript
import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertCircle } from 'lucide-react';
import { useAIAssistant } from '../../../hooks/documents/useAIAssistant';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

interface AIAssistantProps {
  context: Record<string, any>;
  onSuggestion?: (suggestion: string) => void;
}

export function AIAssistant({ context, onSuggestion }: AIAssistantProps) {
  const { 
    analyzeLegalContext,
    suggestions,
    warnings,
    isAnalyzing 
  } = useAIAssistant();

  useEffect(() => {
    analyzeLegalContext(context);
  }, [context]);

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-500">
          Analyzing input...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="flex items-center text-sm font-medium text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Important Considerations
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="flex items-center text-sm font-medium text-blue-800">
            <Lightbulb className="h-5 w-5 mr-2" />
            Suggestions
          </h3>
          <ul className="mt-2 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-blue-700 cursor-pointer hover:text-blue-900"
                onClick={() => onSuggestion?.(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```