import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { MessageSearchBar } from '../search/MessageSearchBar';
import { MessageFilterBar } from '../filters/MessageFilterBar';

export function MessageListHeader() {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <Button
          href="/messages/new"
          icon={<Plus className="h-4 w-4" />}
        >
          New Message
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <MessageSearchBar />
        </div>
        <MessageFilterBar />
      </div>
    </div>
  );
}