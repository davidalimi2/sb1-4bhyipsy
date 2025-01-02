import React from 'react';
import { Badge } from '../../shared/ui/Badge';
import type { DiscoveryStatus } from '../../../types/discovery';

interface DiscoveryBadgeProps {
  status: DiscoveryStatus;
}

export function DiscoveryBadge({ status }: DiscoveryBadgeProps) {
  const variants: Record<DiscoveryStatus, 'warning' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    completed: 'success',
    overdue: 'error',
    withdrawn: 'default'
  };

  return (
    <Badge variant={variants[status]}>
      {status}
    </Badge>
  );
}