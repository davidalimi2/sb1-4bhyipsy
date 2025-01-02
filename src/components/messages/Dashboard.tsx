import { MessageList } from './list/MessageList';
import { MessageSidebar } from './MessageSidebar';
import { MessageListHeader } from './list/MessageListHeader';
import { OfflineIndicator } from './OfflineIndicator';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <MessageSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <MessageListHeader />
              <div className="divide-y">
                <MessageList />
              </div>
            </div>
          </div>
        </div>
      </div>
      <OfflineIndicator />
    </div>
  );
}