```typescript
import { supabase } from '../../lib/supabase';
import { generateStoragePath } from '../storageUtils';

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ATTACHMENTS = 5;

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];

export function validateAttachment(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return { valid: false, error: 'File exceeds maximum size of 10MB' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type' };
  }

  return { valid: true };
}

export async function uploadAttachments(files: File[]): Promise<string[]> {
  const attachmentIds = await Promise.all(
    files.map(async (file) => {
      const path = generateStoragePath('message-attachments', file.name);
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: attachment, error: attachmentError } = await supabase
        .from('message_attachments')
        .insert({
          name: file.name,
          storage_path: path,
          size: file.size,
          type: file.type
        })
        .select()
        .single();

      if (attachmentError) throw attachmentError;
      return attachment.id;
    })
  );

  return attachmentIds;
}
```