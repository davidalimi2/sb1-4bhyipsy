import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../components/shared/ui/BackButton';
import { ContractUploader } from '../../components/contracts/audit/ContractUploader';
import { ContractAnalysis } from '../../components/contracts/audit/ContractAnalysis';
import { ContractChat } from '../../components/contracts/audit/ContractChat';

export function ContractAuditPage() {
  const { id: caseId = '' } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Contract Audit
      </h1>

      {!analysis ? (
        <ContractUploader 
          caseId={caseId}
          onAnalysisComplete={setAnalysis}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContractAnalysis analysis={analysis} />
          <ContractChat analysis={analysis} />
        </div>
      )}
    </div>
  );
}