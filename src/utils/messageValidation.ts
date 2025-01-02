import type { NewMessageData } from '../types/message';

const MAX_SUBJECT_LENGTH = 200;
const MAX_CONTENT_LENGTH = 50000;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];

export function validateMessageData(data: Partial<NewMessageData>): { valid: boolean; error?: string } {
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
    return { valid: false, error: 'Subject cannot exceed ' + MAX_SUBJECT_LENGTH + ' characters' };
  }
  if (data.content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: 'Content cannot exceed ' + MAX_CONTENT_LENGTH + ' characters' };
  }

  // Attachment validations
  if (data.attachments?.length) {
    if (data.attachments.length > MAX_ATTACHMENTS) {
      return { valid: false, error: 'Maximum ' + MAX_ATTACHMENTS + ' attachments allowed' };
    }

    for (const file of data.attachments) {
      if (file.size > MAX_ATTACHMENT_SIZE) {
        return { valid: false, error: 'File ' + file.name + ' exceeds maximum size of 10MB' };
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return { valid: false, error: 'File ' + file.name + ' has an unsupported format' };
      }
    }
  }

  return { valid: true };
}