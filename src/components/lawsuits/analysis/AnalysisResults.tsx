```typescript
import React from 'react';
import { Clock, AlertCircle, FileText, Scale } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import type { LawsuitAnalysis } from '../../../types/lawsuit';

interface AnalysisResultsProps {
  analysis: LawsuitAnalysis;
  onGenerateResponse?: () => void;
}

export function AnalysisResults({ analysis, onGenerateResponse }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Case Summary
        </h3>
        <p className="text-gray-600">{analysis.summary}</p>
      </div>

      {/* Key Dates */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-500" />
          Important Deadlines
        </h3>
        <div className="space-y-4">
          {analysis.deadlines.map((deadline, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                deadline.priority === 'high' ? 'bg-red-50' :
                deadline.priority === 'medium' ? 'bg-yellow-50' :
                'bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{deadline.description}</p>
                  <p className="text-sm text-gray-600">Due: {deadline.date}</p>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {deadline.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
          Required Actions
        </h3>
        <ul className="space-y-3">
          {analysis.requiredActions.map((action, index) => (
            <li key={index} className="flex items-start">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm mr-3">
                {index + 1}
              </span>
              <span className="text-gray-600">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal Analysis */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Scale className="h-5 w-5 mr-2 text-indigo-500" />
          Legal Analysis
        </h3>
        <div className="space-y-4">
          {analysis.legalAnalysis.map((item, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="mt-1 text-gray-600">{item.description}</p>
              {item.citations && (
                <p className="mt-2 text-sm text-gray-500">
                  Citations: {item.citations}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Response Generation */}
      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={onGenerateResponse}
          icon={<FileText className="h-5 w-5" />}
        >
          Generate Response Document
        </Button>
      </div>
    </div>
  );
}
```