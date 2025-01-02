import React from 'react';
import { useParams } from 'react-router-dom';
import { DepositionPrep } from '../../components/depositions/DepositionPrep';
import { BackButton } from '../../components/shared/ui/BackButton';
import { useCase } from '../../hooks/useCase';

export function DepositionPrepPage() {
  const { id: caseId } = useParams();
  const { caseData } = useCase(caseId);

  if (!caseData) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Deposition Preparation
      </h1>

      <DepositionPrep
        caseId={caseId}
        caseType={caseData.type}
      />
    </div>
  );
}