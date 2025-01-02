```typescript
import React from 'react';
import { Lock, FileText, MessageSquare, Calendar } from 'lucide-react';
import { Switch } from '../../shared/ui/Switch';
import { Card } from '../../shared/ui/Card';
import { usePermissions } from '../../../hooks/lawyers/usePermissions';

interface PermissionSettingsProps {
  lawyerId: string;
}

export function PermissionSettings({ lawyerId }: PermissionSettingsProps) {
  const { permissions, isLoading, updatePermissions } = usePermissions(lawyerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Lawyer Access Permissions</h2>
        <Lock className="h-5 w-5 text-gray-400" />
      </div>

      <Card>
        <div className="p-6 space-y-6">
          {/* Documents Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-indigo-500 mt-1" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Document Access</h3>
                <p className="text-sm text-gray-500">
                  Allow lawyer to view and comment on case documents
                </p>
              </div>
            </div>
            <Switch
              checked={permissions?.documents.access || false}
              onChange={(checked) => updatePermissions({
                documents: { ...permissions?.documents, access: checked }
              })}
              disabled={isLoading}
            />
          </div>

          {/* Messaging Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <MessageSquare className="h-6 w-6 text-indigo-500 mt-1" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Direct Messaging</h3>
                <p className="text-sm text-gray-500">
                  Enable direct messaging with this lawyer
                </p>
              </div>
            </div>
            <Switch
              checked={permissions?.messaging || false}
              onChange={(checked) => updatePermissions({ messaging: checked })}
              disabled={isLoading}
            />
          </div>

          {/* Calendar Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <Calendar className="h-6 w-6 text-indigo-500 mt-1" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Calendar Access</h3>
                <p className="text-sm text-gray-500">
                  Allow lawyer to view and schedule meetings
                </p>
              </div>
            </div>
            <Switch
              checked={permissions?.calendar || false}
              onChange={(checked) => updatePermissions({ calendar: checked })}
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Document Permissions</h3>
          {permissions?.documents.access && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">View Documents</p>
                  <p className="text-sm text-gray-500">Access to view case documents</p>
                </div>
                <Switch
                  checked={permissions.documents.view || false}
                  onChange={(checked) => updatePermissions({
                    documents: { ...permissions.documents, view: checked }
                  })}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Comment on Documents</p>
                  <p className="text-sm text-gray-500">Add comments and annotations</p>
                </div>
                <Switch
                  checked={permissions.documents.comment || false}
                  onChange={(checked) => updatePermissions({
                    documents: { ...permissions.documents, comment: checked }
                  })}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload Documents</p>
                  <p className="text-sm text-gray-500">Add new documents to the case</p>
                </div>
                <Switch
                  checked={permissions.documents.upload || false}
                  onChange={(checked) => updatePermissions({
                    documents: { ...permissions.documents, upload: checked }
                  })}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
```