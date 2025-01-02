import React from 'react';
import { Badge } from '../../shared/ui';

interface VersionBadgeProps {
  version: number;
  isCurrent?: boolean;
}

export function VersionBadge({ version, isCurrent }: VersionBadgeProps) {
  return (
    <Badge variant={isCurrent ? 'success' : 'default'}>
      v{version.toString().padStart(2, '0')}
    </Badge>
  );
}