```typescript
import React from 'react';
import { X, GitCompare } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { TemplateVersion } from '../../../types/template';

interface VersionCompareProps {
  sourceVersion: TemplateVersion;
  targetVersion: TemplateVersion;
  onClose: () => void;
}

export function VersionCompare({
  sourceVersion,
  targetVersion,
  onClose
}: VersionCompareProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GitCompare className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Compare Versions
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Version {sourceVersion.version}</span>
            <span className="mx-2">→</span>
            <span>Version {targetVersion.version}</span>
            <span className="mx-2">•</span>
            <span>{formatDateTime(targetVersion.created_at)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Version {sourceVersion.version}
            </h4>
            <div className="prose max-w-none">
              <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(sourceVersion.content, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Version {targetVersion.version}
            </h4>
            <div className="prose max-w-none">
              <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(targetVersion.content, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```