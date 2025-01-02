import { supabase } from '../lib/supabase';
import { generateStoragePath } from './storageUtils';
import type { Message } from '../types/message';

export async function uploadAttachments(files: File[]): Promise<string[]> {
  const attachmentIds = await Promise.all(
    files.map(async (file) => {
      // Upload file to storage
      const path = generateStoragePath('message-attachments', file.name);
      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Create attachment record
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