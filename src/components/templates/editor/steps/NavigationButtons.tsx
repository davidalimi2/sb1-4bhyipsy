import React from 'react';
import { Button } from '../../../shared/ui/Button';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onCancel,
  onSave,
  isLoading
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <Button
        variant="secondary"
        onClick={onBack}
        disabled={currentStep === 0}
      >
        Back
      </Button>
      
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={onSave}
            loading={isLoading}
          >
            Save Template
          </Button>
        ) : (
          <Button onClick={onNext}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}