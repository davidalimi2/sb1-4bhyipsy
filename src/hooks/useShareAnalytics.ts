import { useState, useEffect } from 'react';
import type { ShareAnalytics } from '../types';

export function useShareAnalytics(documentId: string) {
  const [analytics, setAnalytics] = useState<ShareAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setAnalytics([
          {
            id: '1',
            documentId,
            shareId: 'share-1',
            accessedBy: 'john@example.com',
            accessedAt: new Date(),
            accessType: 'view',
            metadata: {
              userAgent: 'Mozilla/5.0...',
              location: 'New York, US'
            }
          }
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [documentId]);

  return { analytics, isLoading, error };
}