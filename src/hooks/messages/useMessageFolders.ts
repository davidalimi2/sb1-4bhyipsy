```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { MessageFolder } from '../../types/message';

export function useMessageFolders() {
  const [folders, setFolders] = useState<MessageFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('message_folders')
          .select(`
            *,
            messages:message_folder_assignments(count)
          `)
          .eq('user_id', user.id)
          .order('position');

        if (error) throw error;

        setFolders(data.map(folder => ({
          ...folder,
          count: folder.messages?.[0]?.count || 0
        })));
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch folders'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, [addNotification]);

  const createFolder = async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('message_folders')
        .insert({
          user_id: user.id,
          name,
          position: folders.length + 1
        })
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, { ...data, count: 0 }]);

      addNotification({
        type: 'success',
        title: 'Folder created',
        message: 'New folder has been created successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create folder'
      });
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase
        .from('message_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      setFolders(prev => prev.filter(f => f.id !== folderId));

      addNotification({
        type: 'success',
        title: 'Folder deleted',
        message: 'Folder has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete folder'
      });
    }
  };

  return {
    folders,
    isLoading,
    createFolder,
    deleteFolder
  };
}
```