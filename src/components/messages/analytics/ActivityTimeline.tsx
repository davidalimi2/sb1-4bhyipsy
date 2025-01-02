import { formatDateTime } from '../../../utils/date';
import { useMessageStore } from '../../../stores/messageStore';

export function ActivityTimeline() {
  const messages = useMessageStore(state => state.messages);

  // Get last 10 messages for timeline
  const recentActivity = messages
    .slice(0, 10)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.map(message => (
          <div key={message.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-500" />
            <div>
              <p className="text-sm font-medium">{message.subject}</p>
              <p className="text-xs text-gray-500">
                {message.sender?.full_name} • {formatDateTime(message.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}