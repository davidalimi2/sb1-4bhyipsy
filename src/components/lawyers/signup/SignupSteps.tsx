```typescript
import React from 'react';
import { ProgressSteps } from '../../lawsuits/wizard/ProgressSteps';

const SIGNUP_STEPS = [
  { title: 'Basic Info' },
  { title: 'Professional Info' },
  { title: 'Bar Verification' },
  { title: 'Profile Setup' }
];

interface SignupStepsProps {
  currentStep: number;
}

export function SignupSteps({ currentStep }: SignupStepsProps) {
  return (
    <ProgressSteps
      steps={SIGNUP_STEPS}
      currentStep={currentStep}
    />
  );
}
```