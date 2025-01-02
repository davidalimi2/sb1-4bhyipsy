import React from 'react';
import { Plus, Minus, Edit2 } from 'lucide-react';
import type { ComparisonResult } from '../../types/comparison';

interface ComparisonSummaryProps {
  changes: ComparisonResult['changes'];
}

export function ComparisonSummary({ changes }: ComparisonSummaryProps) {
  const stats = [
    {
      label: 'Additions',
      count: changes.additions.length,
      icon: Plus,
      color: 'text-green-500'
    },
    {
      label: 'Deletions',
      count: changes.deletions.length,
      icon: Minus,
      color: 'text-red-500'
    },
    {
      label: 'Changes',
      count: changes.modifications.length,
      icon: Edit2,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="border-t border-b border-gray-200">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {stats.map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="px-4 py-3 text-center">
            <div className="flex items-center justify-center text-sm font-medium text-gray-500">
              <Icon className={`h-4 w-4 mr-1.5 ${color}`} />
              {label}
            </div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}