```typescript
import React from 'react';
import { MessageBody } from './MessageBody';
import { MessageAttachments } from './MessageAttachments';
import type { Message } from '../../../types/message';

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="px-6 py-4">
      <MessageBody content={message.content} />
      {message.attachments && <MessageAttachments attachments={message.attachments} />}
    </div>
  );
}
```