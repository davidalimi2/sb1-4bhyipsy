```typescript
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { DocumentEditor } from '../../editor/DocumentEditor';
import type { DocumentAnalysis } from '../../../../types/generation';

interface DocumentPreviewStepProps {
  generatedContent: string | null;
  analysis: DocumentAnalysis | null;
}

export function DocumentPreviewStep({ 
  generatedContent,
  analysis 
}: DocumentPreviewStepProps) {
  if (!generatedContent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No content generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analysis?.suggestions?.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                AI Suggestions
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <DocumentEditor
          content={generatedContent}
          readOnly={false}
          showToolbar={true}
        />
      </div>

      {analysis?.legalCitations?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Legal Citations
          </h4>
          <ul className="space-y-2">
            {analysis.legalCitations.map((citation, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{citation.citation}</span>
                <span className="text-gray-500 ml-2">- {citation.relevance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```