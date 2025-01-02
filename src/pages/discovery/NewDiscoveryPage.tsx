import React from 'react';
import { useParams } from 'react-router-dom';
import { DiscoveryForm } from '../../components/discovery/form/DiscoveryForm';
import { useDiscoveryCreation } from '../../hooks/discovery/useDiscoveryCreation';

export function NewDiscoveryPage() {
  const { caseId = '' } = useParams();
  const { createDiscovery, isSubmitting } = useDiscoveryCreation(caseId);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create Discovery Request
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <DiscoveryForm
          caseId={caseId}
          onSubmit={createDiscovery}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}