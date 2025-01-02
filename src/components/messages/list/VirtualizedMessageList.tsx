```typescript
import { memo } from 'react';
import { useVirtualization } from '../../../hooks/useVirtualization';
import { MessageListItem } from './MessageListItem';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { Message } from '../../../types/message';

interface VirtualizedMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  error?: string | null;
}

const ITEM_HEIGHT = 80; // Height of each message item in pixels

export const VirtualizedMessageList = memo(function VirtualizedMessageList({ 
  messages, 
  isLoading, 
  error 
}: VirtualizedMessageListProps) {
  const {
    containerRef,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
  } = useVirtualization({
    itemCount: messages.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: 600,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <EmptyState
        title="No messages"
        description="Your inbox is empty"
        action={{
          label: "Send Message",
          href: "/messages/new"
        }}
      />
    );
  }

  const visibleMessages = messages.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      className="h-[600px] overflow-auto relative"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleMessages.map((message) => (
            <div key={message.id} style={{ height: ITEM_HEIGHT }}>
              <MessageListItem message={message} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
```