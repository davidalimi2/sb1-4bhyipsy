```typescript
import React from 'react';
import { Clock, AlertCircle, FileText } from 'lucide-react';
import { useAIProgress } from '../../hooks/ai/useAIProgress';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { Button } from '../shared/ui/Button';

interface AIProgressWidgetProps {
  caseId: string;
}

export function AIProgressWidget({ caseId }: AIProgressWidgetProps) {
  const { analysis, isAnalyzing, refreshAnalysis } = useAIProgress(caseId);

  if (isAnalyzing) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">AI Progress Analysis</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={refreshAnalysis}
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Case Progress</span>
            <span className="font-medium">{analysis.completion_percentage}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${analysis.completion_percentage}%` }}
            />
          </div>
        </div>

        {/* Next Actions */}
        {analysis.suggested_actions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-indigo-500" />
              Next Actions
            </h4>
            <ul className="space-y-2">
              {analysis.suggested_actions.slice(0, 3).map((action: any, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-600">{action.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {analysis.risk_factors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              Risk Factors
            </h4>
            <ul className="space-y-2">
              {analysis.risk_factors.slice(0, 2).map((risk: any, index: number) => (
                <li key={index} className="text-sm text-red-600">
                  {risk.factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Documents */}
        {analysis.required_documents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-indigo-500" />
              Required Documents
            </h4>
            <ul className="space-y-2">
              {analysis.required_documents.slice(0, 2).map((doc: any, index: number) => (
                <li key={index} className="text-sm text-gray-600">
                  {doc.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          href={`/cases/${caseId}/analysis`}
          variant="secondary"
          size="sm"
          fullWidth
        >
          View Full Analysis
        </Button>
      </div>
    </div>
  );
}
```