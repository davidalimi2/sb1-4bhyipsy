import React from 'react';
import { ComparisonHeader } from './ComparisonHeader';
import { ComparisonContent } from './ComparisonContent';
import { ComparisonSummary } from './ComparisonSummary';
import type { DocumentVersion } from '../../../types/document';

interface ComparisonViewProps {
  sourceVersion: DocumentVersion;
  targetVersion: DocumentVersion;
  onClose: () => void;
}

export function ComparisonView({ sourceVersion, targetVersion, onClose }: ComparisonViewProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          <ComparisonHeader
            sourceVersion={sourceVersion}
            targetVersion={targetVersion}
            onClose={onClose}
          />
          
          <ComparisonSummary
            sourceVersion={sourceVersion}
            targetVersion={targetVersion}
          />
          
          <ComparisonContent
            sourceVersion={sourceVersion}
            targetVersion={targetVersion}
          />
        </div>
      </div>
    </div>
  );
}