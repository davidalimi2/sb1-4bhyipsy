import React from 'react';
import { useParams } from 'react-router-dom';
import { DiscoveryResponseForm } from '../../components/discovery/response/DiscoveryResponseForm';
import { useDiscoveryResponse } from '../../hooks/discovery/useDiscoveryResponse';

export function DiscoveryResponsePage() {
  const { id = '' } = useParams();
  const { submitResponse, isSubmitting } = useDiscoveryResponse(id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Submit Discovery Response
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <DiscoveryResponseForm
          discoveryId={id}
          onSubmit={submitResponse}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}