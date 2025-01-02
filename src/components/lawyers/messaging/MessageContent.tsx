```typescript
import React from 'react';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  // Handle different content types (text, links, etc)
  const renderContent = () => {
    // Check for URLs and make them clickable
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="whitespace-pre-wrap break-words">
      {renderContent()}
    </div>
  );
}
```