```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  scheduled_for: string;
  duration_minutes: number;
  meeting_url: string;
  status: 'scheduled' | 'started' | 'ended' | 'cancelled';
}

export function useMeetings(caseId: string) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('video_meetings')
          .select('*')
          .eq('case_id', caseId)
          .order('scheduled_for', { ascending: true });

        if (error) throw error;
        setMeetings(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to load meetings'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();

    // Subscribe to meeting changes
    const subscription = supabase
      .channel(`meetings-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'video_meetings', filter: `case_id=eq.${caseId}` },
        () => {
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, addNotification]);

  const cancelMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('video_meetings')
        .update({ status: 'cancelled' })
        .eq('id', meetingId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Meeting cancelled',
        message: 'The video meeting has been cancelled'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to cancel meeting'
      });
    }
  };

  return {
    meetings,
    isLoading,
    cancelMeeting
  };
}
```