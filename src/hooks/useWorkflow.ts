import { useState, useEffect } from 'react';
import type { WorkflowStep, WorkflowStatus, WorkflowAction } from '../types/workflow';

export function useWorkflow(documentId: string) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [history, setHistory] = useState<WorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStep: WorkflowStep = {
          id: '1',
          documentId,
          status: 'draft',
          action: 'submit',
          createdAt: new Date(),
        };
        
        setCurrentStep(mockStep);
        setHistory([mockStep]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workflow');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [documentId]);

  const performAction = async (
    action: WorkflowAction,
    comments?: string
  ) => {
    // Implementation will be added
  };

  return {
    currentStep,
    history,
    isLoading,
    error,
    performAction
  };
}