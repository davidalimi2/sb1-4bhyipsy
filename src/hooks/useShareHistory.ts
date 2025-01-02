import { useState, useEffect } from 'react';
import type { ShareHistory } from '../types';

export function useShareHistory(documentId: string) {
  const [history, setHistory] = useState<ShareHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setHistory([
          {
            id: '1',
            documentId,
            sharedBy: 'current-user',
            sharedWith: 'john@example.com',
            permission: 'view',
            type: 'email',
            createdAt: new Date(),
          }
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch share history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [documentId]);

  const revokeAccess = async (historyId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHistory(prev => prev.map(item => 
        item.id === historyId
          ? { ...item, revokedAt: new Date() }
          : item
      ));
    } catch (err) {
      console.error('Failed to revoke access:', err);
      throw err;
    }
  };

  return { history, isLoading, error, revokeAccess };
}