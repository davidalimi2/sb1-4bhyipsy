```typescript
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { TextArea } from '../../shared/ui/TextArea';
import { Input } from '../../shared/ui/Input';
import { useSendMessage } from '../../../hooks/messages/useSendMessage';

interface LawyerMessageFormProps {
  lawyerId: string;
  lawyerName: string;
  onSuccess?: () => void;
}

export function LawyerMessageForm({ lawyerId, lawyerName, onSuccess }: LawyerMessageFormProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { sendMessage, isSending } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    await sendMessage({
      recipient_id: lawyerId,
      subject,
      content: message
    });

    setSubject('');
    setMessage('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder={`Question for ${lawyerName}`}
        required
      />

      <TextArea
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your legal matter..."
        rows={4}
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSending}
          disabled={!subject.trim() || !message.trim()}
          icon={<Send className="h-4 w-4" />}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}
```