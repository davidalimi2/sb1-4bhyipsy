import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { InfoStep } from './steps/InfoStep';
import { PartiesStep } from './steps/PartiesStep';
import { ClaimsStep } from './steps/ClaimsStep';
import { FactsStep } from './steps/FactsStep';
import { PreviewStep } from './steps/PreviewStep';
import { useLawsuitGeneration } from '../../../hooks/lawsuits/useLawsuitGeneration';
import type { LawsuitDraft } from '../../../types/lawsuit';

interface LawsuitWizardProps {
  caseId: string;
  draft?: LawsuitDraft;
}

export function LawsuitWizard({ caseId, draft }: LawsuitWizardProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: draft?.type || 'complaint',
    jurisdiction: draft?.jurisdiction || '',
    parties: draft?.parties || { plaintiffs: [], defendants: [] },
    claims: draft?.claims || [],
    facts: draft?.facts || [],
    content: draft?.content || ''
  });

  const { generateDocument, isGenerating, analysis } = useLawsuitGeneration();

  const steps = [
    { title: 'Basic Information', component: InfoStep },
    { title: 'Parties', component: PartiesStep },
    { title: 'Claims', component: ClaimsStep },
    { title: 'Facts', component: FactsStep },
    { title: 'Preview & Finalize', component: PreviewStep }
  ];

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalize = async () => {
    try {
      const documentId = await generateDocument({
        caseId,
        type: formData.type,
        content: formData.content,
        metadata: {
          jurisdiction: formData.jurisdiction,
          parties: formData.parties,
          claims: formData.claims,
          facts: formData.facts
        }
      });

      navigate(`/documents/${documentId}/edit`);
    } catch (error) {
      console.error('Failed to generate document:', error);
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

      {/* AI Analysis Warnings */}
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
                  {analysis.warnings.map((warning, index) => (
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
          onClick={handleBack}
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
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleFinalize}
              loading={isGenerating}
              icon={<FileText className="h-4 w-4" />}
            >
              Generate Document
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              loading={isGenerating}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}