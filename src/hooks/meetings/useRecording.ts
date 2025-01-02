```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface RecordingOptions {
  meetingId: string;
  resolution?: '720p' | '1080p';
  mode?: 'individual' | 'mixed';
}

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const startRecording = async ({ meetingId, resolution = '720p', mode = 'mixed' }: RecordingOptions) => {
    try {
      const { data, error } = await supabase.functions.invoke('start-meeting-recording', {
        body: { 
          meetingId,
          resolution,
          mode
        }
      });

      if (error) throw error;

      setRecordingId(data.recordingId);
      setIsRecording(true);

      addNotification({
        type: 'success',
        title: 'Recording Started',
        message: 'Meeting recording has begun'
      });

      return data.recordingId;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Recording Error',
        message: error instanceof Error ? error.message : 'Failed to start recording'
      });
      throw error;
    }
  };

  const stopRecording = async () => {
    if (!recordingId) return;

    try {
      const { error } = await supabase.functions.invoke('stop-meeting-recording', {
        body: { recordingId }
      });

      if (error) throw error;

      setIsRecording(false);
      setRecordingId(null);

      addNotification({
        type: 'success',
        title: 'Recording Stopped',
        message: 'Meeting recording has been saved'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Recording Error',
        message: error instanceof Error ? error.message : 'Failed to stop recording'
      });
      throw error;
    }
  };

  return {
    isRecording,
    recordingId,
    startRecording,
    stopRecording
  };
}
```