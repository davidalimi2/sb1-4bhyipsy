import React from 'react';
import { useParams } from 'react-router-dom';
import { LawsuitWizard } from '../components/lawsuits/wizard/LawsuitWizard';
import { LoadingSpinner } from '../components/shared/ui/LoadingSpinner';
import { BackButton } from '../components/shared/ui/BackButton';
import { useLawsuitTemplate } from '../hooks/lawsuits/useLawsuitTemplate';
import { useLawsuitDraft } from '../hooks/lawsuits/useLawsuitDraft';

export function DraftLawsuitPage() {
  const { id: caseId = '' } = useParams();
  const { template, isLoading: templateLoading } = useLawsuitTemplate('complaint');
  const { draft, isLoading: draftLoading } = useLawsuitDraft(caseId);

  if (templateLoading || draftLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Draft Complaint
      </h1>

      <LawsuitWizard
        caseId={caseId}
        draft={draft}
      />
    </div>
  );
}