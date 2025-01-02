import { useEffect } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import { OfflineStorage } from '../../utils/offlineStorage';
import { useNotifications } from '../useNotifications';

export function useOfflineSync() {
  const { messages, setMessages } = useMessageStore();
  const { addNotification } = useNotifications();
  const offlineStorage = new OfflineStorage();

  useEffect(() => {
    const initSync = async () => {
      await offlineStorage.init();

      // Load cached messages when offline
      if (!navigator.onLine) {
        const cachedMessages = await offlineStorage.getMessages();
        setMessages(cachedMessages);
        
        addNotification({
          type: 'info',
          title: 'Offline Mode',
          message: 'Working in offline mode. Changes will sync when back online.'
        });
      }

      // Listen for online/offline events
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    };

    const handleOnline = async () => {
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Syncing your changes...'
      });

      // Sync any pending changes
      const syncState = await offlineStorage.getSyncState();
      if (syncState) {
        // TODO: Implement sync logic
      }
    };

    const handleOffline = () => {
      addNotification({
        type: 'warning',
        title: 'Offline Mode',
        message: 'You are now working offline. Changes will sync when back online.'
      });
    };

    initSync();
  }, [addNotification, setMessages]);

  // Save messages to IndexedDB when they change
  useEffect(() => {
    if (messages.length > 0) {
      offlineStorage.saveMessages(messages);
    }
  }, [messages]);

  return {
    isOnline: navigator.onLine
  };
}