```typescript
import type { Message } from '../../types/message';

export function formatMessagePreview(content: string, maxLength: number = 100): string {
  const stripped = content.replace(/<[^>]+>/g, '').trim();
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength)}...`;
}

export function getMessageSubject(subject: string, isReply: boolean = false): string {
  if (isReply && !subject.toLowerCase().startsWith('re:')) {
    return `Re: ${subject}`;
  }
  return subject;
}

export function getRecipientName(message: Message, currentUserId: string): string {
  return message.sender_id === currentUserId 
    ? message.recipient?.full_name || 'Unknown'
    : message.sender?.full_name || 'Unknown';
}
```