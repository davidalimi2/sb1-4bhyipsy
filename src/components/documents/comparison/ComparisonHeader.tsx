import React from 'react';
import { X, GitCompare } from 'lucide-react';
import { VersionBadge } from '../versions/VersionBadge';
import { formatDateTime } from '../../../utils/date';
import type { DocumentVersion } from '../../../types/document';

interface ComparisonHeaderProps {
  sourceVersion: DocumentVersion;
  targetVersion: DocumentVersion;
  onClose: () => void;
}

export function ComparisonHeader({ sourceVersion, targetVersion, onClose }: ComparisonHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GitCompare className="h-5 w-5 text-gray-400" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">Compare Versions</h2>
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
              <VersionBadge version={sourceVersion.version} />
              <span>→</span>
              <VersionBadge version={targetVersion.version} />
              <span className="text-gray-400">•</span>
              <span>{formatDateTime(targetVersion.created_at)}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}