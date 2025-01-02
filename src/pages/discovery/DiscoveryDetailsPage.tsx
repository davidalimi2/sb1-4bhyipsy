import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DiscoveryDetails } from '../../components/discovery/details/DiscoveryDetails';
import { ResponseList } from '../../components/discovery/response/ResponseList';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';
import { useDiscoveryDetails } from '../../hooks/discovery/useDiscoveryDetails';

export function DiscoveryDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { discovery, isLoading } = useDiscoveryDetails(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!discovery) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Discovery request not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <DiscoveryDetails
        discovery={discovery}
        onRespond={() => navigate(`/discovery/${id}/respond`)}
      />

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Responses</h3>
        <ResponseList responses={discovery.responses || []} />
      </div>
    </div>
  );
}