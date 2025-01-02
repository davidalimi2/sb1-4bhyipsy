import { useState } from 'react';
import type { NewMessageData } from '../../types/message';

const MAX_SUBJECT_LENGTH = 200;
const MAX_CONTENT_LENGTH = 50000;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

type ValidationErrors = Partial<Record<keyof NewMessageData, string>>;

export function useMessageValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof NewMessageData, value: any) => {
    switch (field) {
      case 'recipient_id':
        if (!value?.trim()) {
          setErrors(prev => ({ ...prev, recipient_id: 'Recipient is required' }));
        } else {
          setErrors(prev => {
            const { recipient_id, ...rest } = prev;
            return rest;
          });
        }
        break;

      case 'subject':
        if (!value?.trim()) {
          setErrors(prev => ({ ...prev, subject: 'Subject is required' }));
        } else if (value.length > MAX_SUBJECT_LENGTH) {
          setErrors(prev => ({ ...prev, subject: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters` }));
        } else {
          setErrors(prev => {
            const { subject, ...rest } = prev;
            return rest;
          });
        }
        break;

      case 'content':
        if (!value?.trim()) {
          setErrors(prev => ({ ...prev, content: 'Message content is required' }));
        } else if (value.length > MAX_CONTENT_LENGTH) {
          setErrors(prev => ({ ...prev, content: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters` }));
        } else {
          setErrors(prev => {
            const { content, ...rest } = prev;
            return rest;
          });
        }
        break;

      case 'attachments':
        if (value?.length > MAX_ATTACHMENTS) {
          setErrors(prev => ({ ...prev, attachments: `Maximum ${MAX_ATTACHMENTS} attachments allowed` }));
        } else if (value?.some((file: File) => file.size > MAX_ATTACHMENT_SIZE)) {
          setErrors(prev => ({ ...prev, attachments: 'Some files exceed the maximum size of 10MB' }));
        } else {
          setErrors(prev => {
            const { attachments, ...rest } = prev;
            return rest;
          });
        }
        break;
    }
  };

  const validateForm = (data: NewMessageData): boolean => {
    let newErrors: ValidationErrors = {};

    if (!data.recipient_id?.trim()) {
      newErrors.recipient_id = 'Recipient is required';
    }
    if (!data.subject?.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!data.content?.trim()) {
      newErrors.content = 'Message content is required';
    }
    if (data.attachments?.length > MAX_ATTACHMENTS) {
      newErrors.attachments = `Maximum ${MAX_ATTACHMENTS} attachments allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    validateField,
    validateForm
  };
}