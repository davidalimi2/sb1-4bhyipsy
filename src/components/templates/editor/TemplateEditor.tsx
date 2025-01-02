import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorContent } from './EditorContent';
import { ProgressSteps } from './steps/ProgressSteps';
import { NavigationButtons } from './steps/NavigationButtons';
import { useTemplateEditor } from '../../../hooks/templates/useTemplateEditor';
import type { Template } from '../../../types/template';

interface TemplateEditorProps {
  initialData?: Partial<Template>;
}

export function TemplateEditor({ initialData }: TemplateEditorProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { template, updateTemplate, saveTemplate, isLoading } = useTemplateEditor(initialData);

  const steps = [
    { title: 'Basic Information' },
    { title: 'Questions' },
    { title: 'Document Structure' }
  ];

  const handleSave = async () => {
    const saved = await saveTemplate();
    if (saved) {
      navigate(`/templates/${saved.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <ProgressSteps 
        steps={steps}
        currentStep={currentStep}
      />

      <EditorContent
        step={currentStep}
        template={template}
        onChange={updateTemplate}
      />

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={() => setCurrentStep(prev => prev - 1)}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onCancel={() => navigate('/templates')}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}