import { Link } from 'react-router-dom';
import { Inbox, Send, File, Archive } from 'lucide-react';
import type { MessageFolder } from '../../../types/message';

interface FolderItemProps {
  folder: MessageFolder;
  isActive: boolean;
}

const icons = {
  inbox: Inbox,
  send: Send,
  file: File,
  archive: Archive
};

export function FolderItem({ folder, isActive }: FolderItemProps) {
  const Icon = icons[folder.icon as keyof typeof icons] || File;

  return (
    <Link
      to={`/messages/folder/${folder.id}`}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md
        ${isActive
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <Icon className="h-5 w-5 mr-2" />
      <span className="flex-1">{folder.name}</span>
      {folder.count > 0 && (
        <span className="ml-2 text-xs font-medium rounded-full bg-gray-100 px-2 py-0.5">
          {folder.count}
        </span>
      )}
    </Link>
  );
}