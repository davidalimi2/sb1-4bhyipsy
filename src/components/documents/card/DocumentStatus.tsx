import React from 'react';
import type { Document } from '../../../types/document';

interface DocumentStatusProps {
  status: Document['status'];
}

export function DocumentStatus({ status }: DocumentStatusProps) {
  const styles = {
    draft: 'bg-yellow-100 text-yellow-800',
    final: 'bg-green-100 text-green-800',
    submitted: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}