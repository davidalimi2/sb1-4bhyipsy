import React from 'react';
import { GitBranch, RotateCcw } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { formatDateTime } from '../../../utils/date';
import type { TemplateVersion } from '../../../types/template';

interface VersionHistoryProps {
  versions: TemplateVersion[];
  currentVersion: string;
  onRestore: (versionId: string) => void;
  onCompare: (sourceId: string, targetId: string) => void;
}

export function VersionHistory({ 
  versions, 
  currentVersion,
  onRestore,
  onCompare 
}: VersionHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Version History</h3>
      
      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-4 rounded-lg border ${
              version.id === currentVersion 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Version {version.version}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(version.created_at)}
                  </p>
                </div>
              </div>
              
              {version.id !== currentVersion && (
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onCompare(currentVersion, version.id)}
                  >
                    Compare
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw className="h-4 w-4" />}
                    onClick={() => onRestore(version.id)}
                  >
                    Restore
                  </Button>
                </div>
              )}
            </div>
            
            {version.changes && (
              <p className="mt-2 text-sm text-gray-600">
                {version.changes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}