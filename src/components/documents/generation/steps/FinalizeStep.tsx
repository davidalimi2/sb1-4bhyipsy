```typescript
import React, { useState } from 'react';
import { FileText, Check } from 'lucide-react';
import { SignaturePanel } from '../../editor/SignaturePanel';
import { Button } from '../../../shared/ui/Button';
import type { DocumentAnalysis } from '../../../../types/generation';

interface FinalizeStepProps {
  analysis: DocumentAnalysis | null;
  onFinalize: () => Promise<void>;
}

export function FinalizeStep({ analysis, onFinalize }: FinalizeStepProps) {
  const [showSignature, setShowSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalize = async () => {
    try {
      setIsSubmitting(true);
      await onFinalize();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Actions */}
      {analysis?.requiredFields?.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <h3 className="text-sm font-medium text-yellow-800">
            Required Actions
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5 space-y-1">
            {analysis.requiredFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {analysis?.nextSteps?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Next Steps After Filing
          </h3>
          <ul className="space-y-4">
            {analysis.nextSteps.map((step, index) => (
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

      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={() => setShowSignature(true)}
          icon={<FileText className="h-5 w-5" />}
          loading={isSubmitting}
        >
          Sign and Finalize Document
        </Button>
      </div>

      {showSignature && (
        <SignaturePanel
          onClose={() => setShowSignature(false)}
          onSigned={handleFinalize}
        />
      )}
    </div>
  );
}
```