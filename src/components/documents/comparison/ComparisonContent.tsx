import React from 'react';
import { useComparison } from '../../../hooks/documents/useComparison';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { DocumentVersion } from '../../../types/document';

interface ComparisonContentProps {
  sourceVersion: DocumentVersion;
  targetVersion: DocumentVersion;
}

export function ComparisonContent({ sourceVersion, targetVersion }: ComparisonContentProps) {
  const { comparison, isLoading } = useComparison(sourceVersion, targetVersion);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No changes detected between versions
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="space-y-4">
        {comparison.additions.map((change) => (
          <div key={change.id} className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Plus className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {change.content}
                </pre>
              </div>
            </div>
          </div>
        ))}

        {comparison.deletions.map((change) => (
          <div key={change.id} className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Minus className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {change.content}
                </pre>
              </div>
            </div>
          </div>
        ))}

        {comparison.modifications.map((change) => (
          <div key={change.id} className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Edit2 className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
              <div>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {change.content}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}