```typescript
export interface MessageFolder {
  id: string;
  name: string;
  icon: string;
  color?: string;
  position: number;
  count?: number;
}

export interface MessageLabel {
  id: string;
  name: string;
  color: string;
}

export interface MessageFilters {
  status: MessageStatus;
  search: string;
  folder?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

export interface MessageSort {
  field: 'created_at' | 'updated_at' | 'subject';
  direction: 'asc' | 'desc';
}

export type MessageStatus = 'unread' | 'read' | 'archived';
```