import React from 'react';
import { useParams } from 'react-router-dom';
import { DiscoveryHub } from '../../components/discovery/DiscoveryHub';
import { BackButton } from '../../components/shared/ui/BackButton';

export function DiscoveryHubPage() {
  const { id: caseId } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>
      <DiscoveryHub caseId={caseId} />
    </div>
  );
}