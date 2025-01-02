```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposeHeader } from './compose/ComposeHeader';
import { ComposeForm } from './compose/ComposeForm';
import { useSendMessage } from '../../hooks/messages/useSendMessage';
import type { NewMessageData } from '../../types/message';

interface ComposeMessageProps {
  replyTo?: {
    id: string;
    subject: string;
    recipient_id: string;
  };
}

export function ComposeMessage({ replyTo }: ComposeMessageProps) {
  const navigate = useNavigate();
  const { sendMessage, isSending } = useSendMessage();
  const [formData, setFormData] = useState<NewMessageData>({
    recipient_id: replyTo?.recipient_id || '',
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    content: '',
    parent_id: replyTo?.id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(formData);
    navigate('/messages');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <ComposeHeader
        title={replyTo ? 'Reply to Message' : 'New Message'}
        onClose={() => navigate('/messages')}
      />
      <div className="p-6">
        <ComposeForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSending}
        />
      </div>
    </div>
  );
}
```