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
    <nav aria-label="Progress" className="mb-12">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex-1 flex">
            <div className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <div className={`
                h-12 w-12 rounded-full flex items-center justify-center font-semibold text-base
                ${index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                transition-colors duration-300 ease-in-out z-10
              `}>
                {index + 1}
              </div>
              
              {/* Step title */}
              <span className={`
                absolute top-14 text-sm font-medium w-full text-center
                ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                transition-colors duration-300 ease-in-out
              `}>
                {step.title}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute top-6 left-1/2 w-full h-1
                ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}
                transition-colors duration-300 ease-in-out -z-10
              `} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}