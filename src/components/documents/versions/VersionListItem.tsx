import React from 'react';
import { GitBranch, RotateCcw } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { formatDateTime } from '../../../utils/date';
import { formatFileSize } from '../../../utils/format';
import type { DocumentVersion } from '../../../types/document';

interface VersionListItemProps {
  version: DocumentVersion;
  isCurrent: boolean;
  isActive: boolean;
  onRestore?: () => void;
  onClick?: () => void;
}

export function VersionListItem({
  version,
  isCurrent,
  isActive,
  onRestore,
  onClick
}: VersionListItemProps) {
  return (
    <div
      className={`
        p-4 rounded-lg border cursor-pointer
        ${isActive
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              Version {version.version}
            </span>
            {isCurrent && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {formatDateTime(version.created_at)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {formatFileSize(version.size)}
          </p>
          {version.comment && (
            <p className="mt-2 text-sm text-gray-600">
              {version.comment}
            </p>
          )}
        </div>

        {!isCurrent && onRestore && (
          <Button
            size="sm"
            variant="secondary"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
          >
            Restore
          </Button>
        )}
      </div>
    </div>
  );
}