```typescript
import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSend(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
          rows={3}
          disabled={disabled}
        />
      </div>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="secondary"
          icon={<Paperclip className="h-4 w-4" />}
          disabled={disabled}
        >
          Attach
        </Button>
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          icon={<Send className="h-4 w-4" />}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
```