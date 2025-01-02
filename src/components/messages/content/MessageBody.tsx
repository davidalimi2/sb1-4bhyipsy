```typescript
import React from 'react';

interface MessageBodyProps {
  content: string;
}

export function MessageBody({ content }: MessageBodyProps) {
  return (
    <div className="prose max-w-none">
      {content}
    </div>
  );
}
```