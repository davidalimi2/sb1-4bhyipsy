import { useFolders } from '../../../hooks/messages/useFolders';
import { FolderItem } from './FolderItem';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function FolderList() {
  const { folders, isLoading } = useFolders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          isActive={false} // TODO: Add active state based on current folder
        />
      ))}
    </nav>
  );
}