import React from 'react';
import { User, Clock } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { DiscoveryResponse } from '../../../types/discovery';

interface ResponseHeaderProps {
  response: DiscoveryResponse;
}

export function ResponseHeader({ response }: ResponseHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <User className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">
          {response.created_by}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-1" />
        {formatDateTime(response.created_at)}
      </div>
    </div>
  );
}