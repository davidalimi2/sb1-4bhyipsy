import React from 'react';
import { FileText, Clock, User } from 'lucide-react';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { formatDate } from '../../../utils/date';
import { getDiscoveryTypeLabel } from '../../../utils/discoveryUtils';
import type { Discovery } from '../../../types/discovery';

interface DiscoveryDetailsProps {
  discovery: Discovery;
  onRespond?: () => void;
}

export function DiscoveryDetails({ discovery, onRespond }: DiscoveryDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getDiscoveryTypeLabel(discovery.type)}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {discovery.description}
            </p>
          </div>
          <Badge
            variant={
              discovery.status === 'pending' ? 'warning' :
              discovery.status === 'completed' ? 'success' :
              discovery.status === 'overdue' ? 'error' :
              'default'
            }
          >
            {discovery.status}
          </Badge>
        </div>
      </div>

      <div className="px-6 py-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Due Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(discovery.dueDate)}
            </dd>
          </div>

          {discovery.party && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Responding Party
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {discovery.party}
              </dd>
            </div>
          )}
        </dl>

        {discovery.status === 'pending' && onRespond && (
          <div className="mt-6">
            <Button
              onClick={onRespond}
              icon={<FileText className="h-4 w-4" />}
            >
              Submit Response
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}