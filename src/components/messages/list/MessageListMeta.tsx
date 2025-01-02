import { Mail, Clock, Paperclip } from 'lucide-react';
import { Badge } from '../../shared/ui/Badge';
import type { Message } from '../../../types/message';

interface MessageListMetaProps {
  message: Message;
  isRecipient: boolean;
}

export function MessageListMeta({ message, isRecipient }: MessageListMetaProps) {
  return (
    <div className="mt-1 flex items-center space-x-4 text-xs">
      {!message.read && isRecipient && (
        <Badge variant="info" className="flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          New
        </Badge>
      )}
      {message.parent_id && (
        <span className="flex items-center text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Reply
        </span>
      )}
      {message.attachments?.length > 0 && (
        <span className="flex items-center text-gray-500">
          <Paperclip className="h-3 w-3 mr-1" />
          {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}