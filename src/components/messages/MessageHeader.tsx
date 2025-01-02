```typescript
import React from 'react';
import type { Message } from '../../types/message';

interface MessageHeaderProps {
  message: Message;
}

export function MessageHeader({ message }: MessageHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <h1 className="text-xl font-medium text-gray-900">{message.subject}</h1>
      <div className="mt-1 flex items-center text-sm text-gray-500">
        <span>From: {message.sender?.full_name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(message.created_at).toLocaleString()}</span>
      </div>
    </div>
  );
}
```