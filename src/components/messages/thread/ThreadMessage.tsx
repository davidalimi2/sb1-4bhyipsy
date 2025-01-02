import React from 'react';
import { Reply } from 'lucide-react';
import { Avatar } from '../../shared/ui/Avatar';
import { Button } from '../../shared/ui/Button';
import { MessageAttachments } from '../attachments/AttachmentList';
import { MessageReactions } from '../reactions/MessageReactions';
import { formatDateTime } from '../../../utils/date';
import type { Message } from '../../../types/message';

interface ThreadMessageProps {
  message: Message;
  onReply?: (messageId: string) => void;
  isLast?: boolean;
}

export function ThreadMessage({ message, onReply, isLast }: ThreadMessageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar name={message.sender?.full_name || ''} size="md" />
          <div>
            <div className="font-medium">{message.sender?.full_name}</div>
            <div className="text-sm text-gray-500">
              {formatDateTime(message.created_at)}
            </div>
          </div>
        </div>
        {onReply && isLast && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Reply className="h-4 w-4" />}
            onClick={() => onReply(message.id)}
          >
            Reply
          </Button>
        )}
      </div>

      <div className="mt-4 prose max-w-none">
        {message.content}
      </div>

      {message.attachments?.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <MessageAttachments attachments={message.attachments} />
        </div>
      )}

      <div className="mt-4">
        <MessageReactions messageId={message.id} />
      </div>
    </div>
  );
}