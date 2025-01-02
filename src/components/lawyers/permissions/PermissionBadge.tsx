```typescript
import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface PermissionBadgeProps {
  type: 'documents' | 'messaging' | 'calendar';
  granted: boolean;
}

export function PermissionBadge({ type, granted }: PermissionBadgeProps) {
  const labels = {
    documents: 'Document Access',
    messaging: 'Direct Messaging',
    calendar: 'Calendar Access'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${granted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
    `}>
      {granted ? (
        <Unlock className="h-3 w-3 mr-1" />
      ) : (
        <Lock className="h-3 w-3 mr-1" />
      )}
      {labels[type]}
    </span>
  );
}
```