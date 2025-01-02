```typescript
import React from 'react';
import { ComposeMessage } from './ComposeMessage';
import type { Message } from '../../types/message';

interface MessageReplyProps {
  message: Message;
}

export function MessageReply({ message }: MessageReplyProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reply</h2>
      <ComposeMessage
        replyTo={{
          id: message.id,
          subject: message.subject,
          recipient_id: message.sender_id
        }}
      />
    </div>
  );
}
```