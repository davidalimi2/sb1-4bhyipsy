import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { LetterTypeStep } from './steps/LetterTypeStep';
import { LetterDetailsStep } from './steps/LetterDetailsStep';
import { LetterPreviewStep } from './steps/LetterPreviewStep';
import { useLegalLetter } from '../../hooks/letters/useLegalLetter';

interface LetterWizardProps {
  caseId: string;
}

export function LetterWizard({ caseId }: LetterWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    customType: '',
    recipient: {
      name: '',
      title: '',
      organization: '',
      address: ''
    },
    content: '',
    signature: {
      name: '',
      title: '',
      organization: ''
    }
  });

  const { generateLetter, isGenerating, analysis } = useLegalLetter();

  const steps = [
    { title: 'Letter Type', component: LetterTypeStep },
    { title: 'Letter Details', component: LetterDetailsStep },
    { title: 'Preview & Finalize', component: LetterPreviewStep }
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      const documentId = await generateLetter({
        caseId,
        content: formData.content,
        metadata: {
          type: formData.type,
          recipient: formData.recipient,
          signature: formData.signature
        }
      });
      if (documentId) {
        navigate(`/documents/${documentId}/edit`);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, index) => (
            <li key={step.title} className={`relative ${
              index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
            }`}>
              <div className="flex items-center">
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center
                  ${index < currentStep ? 'bg-indigo-600' :
                    index === currentStep ? 'bg-indigo-600' :
                    'bg-gray-200'
                  }
                `}>
                  <span className="text-white">{index + 1}</span>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">
                  {step.title}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div className="absolute top-4 w-full h-0.5 bg-gray-200" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Analysis Warnings */}
      {analysis?.warnings?.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Review Suggested Changes
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <CurrentStepComponent
          formData={formData}
          onChange={setFormData}
          analysis={analysis}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleNext}
            loading={isGenerating}
            icon={currentStep === steps.length - 1 ? <FileText className="h-4 w-4" /> : undefined}
          >
            {currentStep === steps.length - 1 ? 'Generate Letter' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}