import React from 'react';
import { Check } from 'lucide-react';
import type { Template } from '../../../../types/template';

interface FinalizeStepProps {
  template: Template | null;
  analysis: any;
}

export function FinalizeStep({ template, analysis }: FinalizeStepProps) {
  if (!template) return null;

  return (
    <div className="space-y-6">
      {analysis?.requiredFields?.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <h3 className="text-sm font-medium text-yellow-800">
            Required Actions
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5 space-y-1">
            {analysis.requiredFields.map((field: string, index: number) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis?.nextSteps?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Next Steps After Filing
          </h3>
          <ul className="space-y-4">
            {analysis.nextSteps.map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-600">{step}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}