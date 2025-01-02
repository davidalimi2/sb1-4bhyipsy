import { Avatar } from '../../shared/ui/Avatar';
import { MessageAttachments } from '../attachments/MessageAttachments';
import { MessageActions } from '../actions/MessageActions';
import { formatDateTime } from '../../../utils/date';
import type { Message } from '../../../types/message';

interface MessageThreadItemProps {
  message: Message;
  onReply?: () => void;
}

export function MessageThreadItem({ message, onReply }: MessageThreadItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar name={message.sender?.full_name || ''} size="md" />
          <div>
            <div className="font-medium">{message.sender?.full_name}</div>
            <div className="text-sm text-gray-500">
              {formatDateTime(message.created_at)}
            </div>
          </div>
        </div>
        <MessageActions message={message} onReply={onReply} />
      </div>

      <div className="mt-4 prose max-w-none">
        {message.content}
      </div>

      {message.attachments?.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <MessageAttachments attachments={message.attachments} />
        </div>
      )}
    </div>
  );
}