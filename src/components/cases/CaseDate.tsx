import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/date';

interface CaseDateProps {
  date: string | Date | null | undefined;
}

export function CaseDate({ date }: CaseDateProps) {
  if (!date) return null;

  return (
    <div className="flex items-center">
      <Clock className="h-4 w-4 mr-1" />
      <span>{formatDateTime(date)}</span>
    </div>
  );
}