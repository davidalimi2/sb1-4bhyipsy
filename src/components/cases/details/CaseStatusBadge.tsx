import React from 'react';
import type { Case } from '../../../types';

interface CaseStatusBadgeProps {
  status: Case['status'];
  className?: string;
}

export function CaseStatusBadge({ status, className = '' }: CaseStatusBadgeProps) {
  const styles = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.replace('_', ' ')}
    </span>
  );
}