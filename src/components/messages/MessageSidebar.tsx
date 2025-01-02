import { Mail, Send, Archive, Trash2, PenSquare } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useMessageStore } from '../../stores/messageStore';

export function MessageSidebar() {
  const { unreadCount } = useMessageStore();

  const folders = [
    { icon: Mail, label: 'Inbox', count: unreadCount, href: '/messages/inbox' },
    { icon: Send, label: 'Sent', href: '/messages/sent' },
    { icon: Archive, label: 'Archived', href: '/messages/archived' },
    { icon: Trash2, label: 'Trash', href: '/messages/trash' }
  ];

  return (
    <div className="h-full bg-white">
      <div className="p-4">
        <Button
          href="/messages/new"
          icon={<PenSquare className="w-4 h-4" />}
          fullWidth
        >
          Compose
        </Button>
      </div>
      
      <nav className="px-2 pb-4">
        {folders.map(({ icon: Icon, label, count, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}