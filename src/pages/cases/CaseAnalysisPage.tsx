import React from 'react';
import { useParams } from 'react-router-dom';
import { CaseProgressAnalyzer } from '../../components/cases/analysis/CaseProgressAnalyzer';
import { BackButton } from '../../components/shared/ui/BackButton';

export function CaseAnalysisPage() {
  const { id: caseId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Case Analysis
      </h1>

      <CaseProgressAnalyzer caseId={caseId} />
    </div>
  );
}