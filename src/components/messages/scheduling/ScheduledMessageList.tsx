import { formatDateTime } from '../../../utils/date';
import { useScheduledMessages } from '../../../hooks/messages/useScheduledMessages';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function ScheduledMessageList() {
  const { scheduledMessages, isLoading, cancelScheduledMessage } = useScheduledMessages();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!scheduledMessages.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No scheduled messages
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scheduledMessages.map((message) => (
        <div
          key={message.id}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{message.subject}</h3>
              <p className="text-sm text-gray-500">
                To: {message.recipient?.full_name}
              </p>
              <p className="text-sm text-gray-500">
                Scheduled for: {formatDateTime(message.scheduled_for)}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => cancelScheduledMessage(message.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}