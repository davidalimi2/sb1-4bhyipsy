import React from 'react';
import { Plus } from 'lucide-react';
import { DiscoveryList } from './DiscoveryList';
import { DiscoveryStats } from './DiscoveryStats';
import { Button } from '../shared/ui/Button';
import { useDiscovery } from '../../hooks/discovery/useDiscovery';

interface DiscoveryHubProps {
  caseId: string;
}

export function DiscoveryHub({ caseId }: DiscoveryHubProps) {
  const { discovery, isLoading } = useDiscovery(caseId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Discovery Hub</h2>
        <Button
          href={`/cases/${caseId}/discovery/new`}
          icon={<Plus className="h-4 w-4" />}
        >
          New Request
        </Button>
      </div>

      <DiscoveryStats discovery={discovery} isLoading={isLoading} />
      
      <div className="bg-white shadow rounded-lg">
        <DiscoveryList 
          discovery={discovery} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}