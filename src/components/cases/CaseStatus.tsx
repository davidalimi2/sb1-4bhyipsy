import React from 'react';
import type { Case } from '../../types';

interface CaseStatusProps {
  status: Case['status'];
}

export function CaseStatus({ status }: CaseStatusProps) {
  const statusStyles = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}