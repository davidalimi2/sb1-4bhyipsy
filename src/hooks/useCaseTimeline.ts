import { useState, useEffect } from 'react';
import type { TimelineEvent } from '../types';

export function useCaseTimeline(caseId: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setEvents([
          {
            id: '1',
            type: 'status',
            description: 'Case opened',
            timestamp: new Date(),
          },
          {
            id: '2',
            type: 'document',
            description: 'Initial complaint filed',
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch timeline');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [caseId]);

  return { events, isLoading, error };
}