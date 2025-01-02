import { useState } from 'react';
import { Plus, Folder } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { useFolderManagement } from '../../../hooks/messages/useFolderManagement';
import { useFolders } from '../../../hooks/messages/useFolders';

export function FolderManager() {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { createFolder, deleteFolder, isLoading } = useFolderManagement();
  const { folders } = useFolders();

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    await createFolder(newFolderName);
    setNewFolderName('');
    setShowNewFolder(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Folders</h3>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setShowNewFolder(true)}
        >
          New Folder
        </Button>
      </div>

      {showNewFolder && (
        <div className="space-y-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            icon={<Folder className="h-4 w-4 text-gray-400" />}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowNewFolder(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateFolder}
              loading={isLoading}
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <Folder className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{folder.name}</span>
            </div>
            {folder.name !== 'Inbox' && folder.name !== 'Sent' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => deleteFolder(folder.id)}
                loading={isLoading}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}