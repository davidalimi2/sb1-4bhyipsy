```typescript
export interface MessageFilters {
  status: 'all' | 'unread' | 'read' | 'archived';
  search: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  sender?: string;
  hasAttachments?: boolean;
  labels?: string[];
  folder?: string;
  priority?: 'high' | 'normal' | 'low';
  sortBy: 'date' | 'sender' | 'subject';
  sortOrder: 'asc' | 'desc';
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'date' | 'boolean' | 'text' | 'multi-select';
  options?: Array<{ value: string; label: string }>;
  value: any;
}
```