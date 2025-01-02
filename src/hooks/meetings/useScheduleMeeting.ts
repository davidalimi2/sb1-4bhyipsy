import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface ScheduleMeetingOptions {
  caseId: string;
  title: string;
  description?: string;
  scheduledFor: Date;
  durationMinutes?: number;
}

export function useScheduleMeeting() {
  const [isScheduling, setIsScheduling] = useState(false);
  const { addNotification } = useNotifications();

  const scheduleMeeting = async (options: ScheduleMeetingOptions) => {
    try {
      setIsScheduling(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Generate meeting URL (in production, integrate with a video platform API)
      const meetingId = crypto.randomUUID();
      const meetingUrl = `https://meet.example.com/${meetingId}`;

      // Create meeting record
      const { error: meetingError } = await supabase
        .from('video_meetings')
        .insert({
          case_id: options.caseId,
          host_id: user.id,
          title: options.title,
          description: options.description,
          scheduled_for: options.scheduledFor.toISOString(),
          duration_minutes: options.durationMinutes || 60,
          meeting_url: meetingUrl
        });

      if (meetingError) throw meetingError;

      addNotification({
        type: 'success',
        title: 'Meeting scheduled',
        message: 'Video meeting has been scheduled successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to schedule meeting'
      });
      throw error;
    } finally {
      setIsScheduling(false);
    }
  };

  return {
    scheduleMeeting,
    isScheduling
  };
}