```typescript
import React from 'react';
import { Filter } from 'lucide-react';
import { Select } from '../../shared/ui/Select';
import { useMessageStore } from '../../../stores/messageStore';
import type { MessageStatus } from '../../../types/message';

export function MessageFilters() {
  const { filters, setFilters } = useMessageStore();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Status:</span>
      </div>

      <Select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as MessageStatus })}
        className="w-40"
      >
        <option value="unread">Unread</option>
        <option value="read">Read</option>
        <option value="archived">Archived</option>
      </Select>
    </div>
  );
}
```