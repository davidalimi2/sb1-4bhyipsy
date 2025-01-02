import { Wifi, WifiOff } from 'lucide-react';
import { useOfflineSync } from '../../hooks/messages/useOfflineSync';

export function OfflineIndicator() {
  const { isOnline } = useOfflineSync();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <WifiOff className="h-5 w-5" />
      <span>Working Offline</span>
    </div>
  );
}