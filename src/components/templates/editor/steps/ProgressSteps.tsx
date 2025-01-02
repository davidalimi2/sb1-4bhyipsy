import React from 'react';

interface Step {
  title: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.title} className="relative">
            <div className="flex items-center">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span className="text-white">{index + 1}</span>
              </div>
              <span className={`ml-4 text-sm font-medium ${
                index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
              }`}>
                {step.title}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}