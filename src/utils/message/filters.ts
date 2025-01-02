```typescript
import type { Message, MessageFilters } from '../../types/message';

export function applyMessageFilters(messages: Message[], filters: MessageFilters): Message[] {
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

    // Sender filter
    if (filters.sender && message.sender_id !== filters.sender) {
      return false;
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

    // Folder filter
    if (filters.folder && message.folder?.id !== filters.folder) {
      return false;
    }

    // Priority filter
    if (filters.priority && message.priority !== filters.priority) {
      return false;
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
}

export function sortMessages(messages: Message[], sortBy: string, sortOrder: 'asc' | 'desc'): Message[] {
  return [...messages].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'sender':
        comparison = (a.sender?.full_name || '').localeCompare(b.sender?.full_name || '');
        break;
      case 'subject':
        comparison = a.subject.localeCompare(b.subject);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
```