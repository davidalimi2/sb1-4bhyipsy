```typescript
import type { NewMessageData } from '../../types/message';

const MAX_SUBJECT_LENGTH = 200;
const MAX_CONTENT_LENGTH = 50000;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

export function validateMessageData(data: NewMessageData): { valid: boolean; error?: string } {
  // Required fields
  if (!data.recipient_id?.trim()) {
    return { valid: false, error: 'Recipient is required' };
  }
  if (!data.subject?.trim()) {
    return { valid: false, error: 'Subject is required' };
  }
  if (!data.content?.trim()) {
    return { valid: false, error: 'Message content is required' };
  }

  // Length validations
  if (data.subject.length > MAX_SUBJECT_LENGTH) {
    return { valid: false, error: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters` };
  }
  if (data.content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters` };
  }

  // Attachment validations
  if (data.attachments?.length > MAX_ATTACHMENTS) {
    return { valid: false, error: `Maximum ${MAX_ATTACHMENTS} attachments allowed` };
  }
  if (data.attachments?.some(file => file.size > MAX_ATTACHMENT_SIZE)) {
    return { valid: false, error: 'Some files exceed the maximum size of 10MB' };
  }

  return { valid: true };
}
```