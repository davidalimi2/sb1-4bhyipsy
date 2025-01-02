import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { VersionList } from './VersionList';
import { CreateVersionDialog } from './CreateVersionDialog';
import { useVersionManagement } from '../../../hooks/documents/useVersionManagement';
import type { Document, DocumentVersion } from '../../../types/document';

interface VersionManagerProps {
  document: Document;
  activeVersion?: DocumentVersion;
  onVersionSelect: (version: DocumentVersion) => void;
}

export function VersionManager({
  document,
  activeVersion,
  onVersionSelect
}: VersionManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createVersion, restoreVersion } = useVersionManagement({
    document,
    onSuccess: () => setIsCreateDialogOpen(false)
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Versions</h3>
        <Button
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          New Version
        </Button>
      </div>

      <VersionList
        document={document}
        activeVersion={activeVersion}
        onVersionSelect={onVersionSelect}
        onRestore={restoreVersion}
      />

      {isCreateDialogOpen && (
        <CreateVersionDialog
          document={document}
          onSubmit={createVersion}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      )}
    </div>
  );
}