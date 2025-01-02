```typescript
import React from 'react';
import type { Message } from '../../types/message';

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  return (
    <div className="px-6 py-4">
      <div className="prose max-w-none">
        {message.content}
      </div>
    </div>
  );
}
```