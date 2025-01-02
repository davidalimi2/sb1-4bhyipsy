```typescript
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { usePermissions } from '../../../hooks/lawyers/usePermissions';

interface PermissionGuardProps {
  lawyerId: string;
  requiredPermission: 'documents.view' | 'documents.comment' | 'documents.upload' | 'messaging' | 'calendar';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ lawyerId, requiredPermission, children, fallback }: PermissionGuardProps) {
  const { permissions, isLoading } = usePermissions(lawyerId);

  if (isLoading) {
    return null;
  }

  // Check nested permissions (e.g., documents.view)
  const hasPermission = requiredPermission.split('.').reduce((obj: any, key) => {
    return obj?.[key];
  }, permissions);

  if (!hasPermission) {
    return fallback || (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Lock className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center">
          You don't have permission to access this content.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          href={`/lawyers/${lawyerId}/permissions`}
        >
          Request Access
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
```