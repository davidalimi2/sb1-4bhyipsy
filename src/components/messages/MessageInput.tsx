import React, { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { AttachmentUpload } from './attachments/AttachmentUpload';
import { useMessageAttachments } from '../../hooks/messages/useMessageAttachments';

interface MessageInputProps {
  onSend: (content: string, attachmentIds?: string[]) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const { uploadAttachments, isUploading } = useMessageAttachments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !attachments.length) || disabled || isUploading) return;

    try {
      // Upload attachments first if any
      let attachmentIds: string[] = [];
      if (attachments.length) {
        attachmentIds = await uploadAttachments(attachments);
      }

      // Send message with attachments
      await onSend(message, attachmentIds);
      
      // Clear form
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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
          disabled={disabled || isUploading}
        />
        {attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <AttachmentUpload
          onSelect={(files) => setAttachments(prev => [...prev, ...files])}
          disabled={disabled || isUploading}
        />
        <Button
          type="submit"
          disabled={(!message.trim() && !attachments.length) || disabled || isUploading}
          loading={isUploading}
          icon={<Send className="h-4 w-4" />}
        >
          Send
        </Button>
      </div>
    </form>
  );
}