import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface GrammarIssue {
  offset: number;
  length: number;
  message: string;
  type: 'grammar' | 'spelling';
  suggestions: string[];
}

interface GrammarCheckerProps {
  content: string;
  onFix: (start: number, end: number, replacement: string) => void;
}

export function GrammarChecker({ content, onFix }: GrammarCheckerProps) {
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkGrammar = async () => {
      if (!content.trim()) return;
      
      setLoading(true);
      try {
        // Call LanguageTool API
        const response = await fetch('https://api.languagetool.org/v2/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            text: content,
            language: 'en-US',
            disabledRules: 'WHITESPACE_RULE,UPPERCASE_SENTENCE_START'
          })
        });

        const data = await response.json();
        setIssues(data.matches.map((match: any) => ({
          offset: match.offset,
          length: match.length,
          message: match.message,
          type: match.rule.category.id === 'TYPOS' ? 'spelling' : 'grammar',
          suggestions: match.replacements.map((r: any) => r.value)
        })));
      } catch (error) {
        console.error('Grammar check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(checkGrammar, 1000);
    return () => clearTimeout(debounce);
  }, [content]);

  if (loading || !issues.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        Grammar & Spelling
      </h3>
      {issues.map((issue, index) => (
        <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-yellow-700">{issue.message}</p>
            {issue.suggestions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {issue.suggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    className="text-xs bg-white px-2 py-1 rounded border border-yellow-200 hover:bg-yellow-100"
                    onClick={() => onFix(issue.offset, issue.offset + issue.length, suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}