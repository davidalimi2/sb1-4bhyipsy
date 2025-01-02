import React from 'react';
import { FileText } from 'lucide-react';
import { ResponseContent } from './ResponseContent';
import { EmptyState } from '../../shared/EmptyState';
import type { DiscoveryResponse } from '../../../types/discovery';

interface ResponseListProps {
  responses: DiscoveryResponse[];
}

export function ResponseList({ responses }: ResponseListProps) {
  if (!responses?.length) {
    return (
      <EmptyState
        title="No responses yet"
        description="Responses will appear here once submitted"
        icon={FileText}
      />
    );
  }

  return (
    <div className="space-y-6">
      {responses.map((response) => (
        <div key={response.id} className="bg-gray-50 rounded-lg p-4">
          <ResponseContent response={response} />
        </div>
      ))}
    </div>
  );
}