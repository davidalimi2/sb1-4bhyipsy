import React from 'react';
import { DiscoveryItem } from './DiscoveryItem';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { Discovery } from '../../types/discovery';

interface DiscoveryListProps {
  discovery: Discovery[];
  isLoading: boolean;
}

export function DiscoveryList({ discovery, isLoading }: DiscoveryListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!discovery.length) {
    return (
      <EmptyState
        title="No discovery requests"
        description="Start by creating your first discovery request"
        action={{
          label: "Create Request",
          href: "/discovery/new"
        }}
      />
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {discovery.map(item => (
            <DiscoveryItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}