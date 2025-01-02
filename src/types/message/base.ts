```typescript
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  sender?: {
    full_name: string;
  };
  recipient?: {
    full_name: string;
  };
  attachments?: MessageAttachment[];
  labels?: MessageLabel[];
  folder?: MessageFolder;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

export interface NewMessageData {
  recipient_id: string;
  subject: string;
  content: string;
  parent_id?: string | null;
  attachments?: File[];
}
```