import React from 'react';
import { Card } from '../components/shared/ui/Card';
import { NewCaseForm } from '../components/cases/NewCaseForm';
import { useCreateCase } from '../hooks/cases/useCreateCase';

export function NewCasePage() {
  const { createCase, isSubmitting } = useCreateCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Case</h1>
      <Card>
        <NewCaseForm 
          onSubmit={createCase}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}