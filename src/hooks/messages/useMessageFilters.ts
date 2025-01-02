```typescript
import { useCallback } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { useDebounce } from '../ui/useDebounce';
import type { MessageFilters } from '../../types/message';

const defaultFilters: MessageFilters = {
  status: 'all',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc'
};

export function useMessageFilters() {
  const { filters, setFilters } = useMessageStore();
  const debouncedSetFilters = useDebounce(setFilters, 300);

  const updateFilters = useCallback((updates: Partial<MessageFilters>) => {
    debouncedSetFilters(prev => ({
      ...prev,
      ...updates
    }));
  }, [debouncedSetFilters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  const applyFilters = useCallback((messages: any[]) => {
    return messages.filter(message => {
      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'unread' && message.read) return false;
        if (filters.status === 'read' && !message.read) return false;
        if (filters.status === 'archived' && !message.archived) return false;
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const date = new Date(message.created_at);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (date.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            if (date < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            if (date < monthAgo) return false;
            break;
        }
      }

      // Attachments filter
      if (filters.hasAttachments && (!message.attachments || !message.attachments.length)) {
        return false;
      }

      // Labels filter
      if (filters.labels?.length) {
        const messageLabels = message.labels?.map(l => l.id) || [];
        if (!filters.labels.some(id => messageLabels.includes(id))) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          message.subject?.toLowerCase().includes(search) ||
          message.content?.toLowerCase().includes(search) ||
          message.sender?.full_name?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    applyFilters
  };
}
```