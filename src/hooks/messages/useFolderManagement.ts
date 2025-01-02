import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { MessageFolder } from '../../types/message';

export function useFolderManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const createFolder = async (name: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('message_folders')
        .insert({
          user_id: user.id,
          name,
          position: 0 // Will be updated by trigger
        });

      if (error) throw error;

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
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('message_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

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
    } finally {
      setIsLoading(false);
    }
  };

  const reorderFolders = async (folders: MessageFolder[]) => {
    try {
      setIsLoading(true);
      const updates = folders.map((folder, index) => ({
        id: folder.id,
        position: index
      }));

      const { error } = await supabase
        .from('message_folders')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to reorder folders'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFolder,
    deleteFolder,
    reorderFolders,
    isLoading
  };
}