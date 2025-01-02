```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageHeader } from '../components/messages/MessageHeader';
import { MessageContent } from '../components/messages/MessageContent';
import { MessageReply } from '../components/messages/MessageReply';
import { LoadingSpinner } from '../components/shared/ui/LoadingSpinner';
import { useMessage } from '../hooks/messages/useMessage';

export function MessageDetailsPage() {
  const { id = '' } = useParams();
  const { message, isLoading } = useMessage(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <MessageHeader message={message} />
        <MessageContent message={message} />
        <MessageReply message={message} />
      </div>
    </div>
  );
}
```