```typescript
import React from 'react';
import { MessageListItem } from './list/MessageListItem';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { useMessages } from '../../hooks/messages/useMessages';

export function MessageList() {
  const { messages, isLoading, markAsRead } = useMessages();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <EmptyState
        title="No messages"
        description="You don't have any messages yet"
        action={{
          label: "Send Message",
          href: "/messages/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {messages.map(message => (
        <MessageListItem
          key={message.id}
          message={message}
          onRead={() => markAsRead(message.id)}
        />
      ))}
    </div>
  );
}
```