import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { VersionListItem } from './VersionListItem';
import { useDocumentVersions } from '../../../hooks/useDocumentVersions';
import type { Document, DocumentVersion } from '../../../types/document';

interface VersionListProps {
  document: Document;
  activeVersion?: DocumentVersion;
  onVersionSelect: (version: DocumentVersion) => void;
  onCreateVersion: () => void;
}

export function VersionList({
  document,
  activeVersion,
  onVersionSelect,
  onCreateVersion
}: VersionListProps) {
  const { versions, isLoading, restoreVersion } = useDocumentVersions(document.id);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Versions</h3>
        <Button
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={onCreateVersion}
        >
          New Version
        </Button>
      </div>

      <div className="space-y-4">
        {versions.map((version) => (
          <VersionListItem
            key={version.id}
            version={version}
            isCurrent={version.id === document.current_version_id}
            isActive={version.id === activeVersion?.id}
            onRestore={() => restoreVersion(version.id)}
            onClick={() => onVersionSelect(version)}
          />
        ))}
      </div>
    </div>
  );
}