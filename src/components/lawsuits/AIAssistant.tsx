```typescript
import React from 'react';
import { Lightbulb, AlertCircle } from 'lucide-react';
import { useAIAssistant } from '../../hooks/lawsuits/useAIAssistant';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';

interface AIAssistantProps {
  content: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

export function AIAssistant({ content, onSuggestionSelect }: AIAssistantProps) {
  const { analyzeLawsuit, isAnalyzing } = useAIAssistant();
  const [analysis, setAnalysis] = React.useState<{
    suggestions: string[];
    warnings: string[];
  }>({ suggestions: [], warnings: [] });

  React.useEffect(() => {
    const analyze = async () => {
      if (!content) return;
      
      const result = await analyzeLawsuit(content);
      setAnalysis({
        suggestions: result.suggestions || [],
        warnings: result.nextQuestions || []
      });
    };

    analyze();
  }, [content]);

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-500">Analyzing content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analysis.warnings.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="flex items-center text-sm font-medium text-yellow-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            Important Considerations
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
            {analysis.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="flex items-center text-sm font-medium text-indigo-800">
            <Lightbulb className="h-5 w-5 mr-2" />
            Suggestions
          </h3>
          <ul className="mt-2 space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm text-indigo-700 cursor-pointer hover:text-indigo-900"
                onClick={() => onSuggestionSelect?.(suggestion)}
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