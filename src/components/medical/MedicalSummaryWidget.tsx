```typescript
import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { useMedicalSummary } from '../../hooks/medical/useMedicalSummary';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { Button } from '../shared/ui/Button';

interface MedicalSummaryWidgetProps {
  caseId: string;
}

export function MedicalSummaryWidget({ caseId }: MedicalSummaryWidgetProps) {
  const { summary, isAnalyzing } = useMedicalSummary(caseId);

  if (isAnalyzing) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!summary) return null;

  const criticalFindings = summary.keyFindings.filter(f => f.severity === 'high');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-indigo-500" />
          Medical Summary
        </h3>
        <Button
          href={`/cases/${caseId}/medical`}
          variant="secondary"
          size="sm"
        >
          View Full Summary
        </Button>
      </div>

      {criticalFindings.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Critical Findings
              </h4>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                {criticalFindings.map((finding, index) => (
                  <li key={index}>{finding.condition}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <div className="flex justify-between items-center mb-2">
          <span>Total Records:</span>
          <span className="font-medium">{summary.timeline.length}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Date Range:</span>
          <span className="font-medium">
            {new Date(summary.timeline[0].date).toLocaleDateString()} - 
            {new Date(summary.timeline[summary.timeline.length - 1].date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Key Findings:</span>
          <span className="font-medium">{summary.keyFindings.length}</span>
        </div>
      </div>
    </div>
  );
}
```