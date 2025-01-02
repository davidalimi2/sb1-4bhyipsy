import React from 'react';
import { GitBranch, RotateCcw } from 'lucide-react';
import { Button, Badge } from '../../shared/ui';
import { useDocumentVersions } from '../../../hooks/documents/useDocumentVersions';
import { formatDateTime } from '../../../utils/date';
import type { Document, DocumentVersion } from '../../../types/document';

interface DocumentVersionsProps {
  document: Document;
  activeVersion?: DocumentVersion;
  onVersionSelect: (version: DocumentVersion) => void;
}

export function DocumentVersions({
  document,
  activeVersion,
  onVersionSelect
}: DocumentVersionsProps) {
  const { versions, isLoading, restoreVersion } = useDocumentVersions(document.id);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Versions</h3>
        <Badge variant="info">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`
              p-4 rounded-lg border cursor-pointer
              ${version.id === activeVersion?.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Version {version.version}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDateTime(version.created_at)}
                </p>
                {version.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {version.comment}
                  </p>
                )}
              </div>

              {version.id !== document.current_version_id && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<RotateCcw className="h-4 w-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    restoreVersion(version.id);
                  }}
                >
                  Restore
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}