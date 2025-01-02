```typescript
import React from 'react';
import { Clock, AlertCircle, FileText, Scale } from 'lucide-react';
import { useCaseProgress } from '../../../hooks/cases/useCaseProgress';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { Button } from '../../shared/ui/Button';

interface CaseProgressWidgetProps {
  caseId: string;
}

export function CaseProgressWidget({ caseId }: CaseProgressWidgetProps) {
  const { analysis, isLoading } = useCaseProgress(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Case Progress</h3>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${analysis.completion_percentage}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {analysis.completion_percentage}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{analysis.status_summary}</p>
      </div>

      {/* Next Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
          Next Actions
        </h3>
        <ul className="space-y-2">
          {analysis.suggested_actions.slice(0, 3).map((action, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs mr-2">
                {index + 1}
              </span>
              <span className="text-sm text-gray-600">{action.title}</span>
            </li>
          ))}
        </ul>
        <Button
          href={`/cases/${caseId}/analysis`}
          variant="secondary"
          size="sm"
          className="mt-4 w-full"
        >
          View Full Analysis
        </Button>
      </div>
    </div>
  );
}
```