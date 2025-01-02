import React from 'react';
import { Plus, Minus, Edit2 } from 'lucide-react';
import type { ComparisonResult, Change } from '../../types/comparison';

interface ComparisonContentProps {
  result: ComparisonResult;
}

export function ComparisonContent({ result }: ComparisonContentProps) {
  const renderChange = (change: Change) => {
    const icons = {
      addition: <Plus className="h-4 w-4 text-green-500" />,
      deletion: <Minus className="h-4 w-4 text-red-500" />,
      modification: <Edit2 className="h-4 w-4 text-yellow-500" />
    };

    const backgrounds = {
      addition: 'bg-green-50',
      deletion: 'bg-red-50',
      modification: 'bg-yellow-50'
    };

    return (
      <div
        key={change.id}
        className={`flex items-start p-2 ${backgrounds[change.type]}`}
      >
        <div className="flex-shrink-0 mr-2 mt-1">{icons[change.type]}</div>
        <div>
          <div className="text-sm">
            <span className="text-gray-500">Line {change.lineNumber}:</span>
            <pre className="mt-1 font-mono text-sm">{change.content}</pre>
          </div>
          {change.metadata && (
            <div className="mt-1 text-xs text-gray-500">
              {Object.entries(change.metadata).map(([key, value]) => (
                <span key={key} className="mr-3">
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="space-y-2">
        {result.changes.additions.map(renderChange)}
        {result.changes.deletions.map(renderChange)}
        {result.changes.modifications.map(renderChange)}
      </div>
    </div>
  );
}