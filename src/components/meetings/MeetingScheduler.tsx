```typescript
import React, { useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { TextArea } from '../shared/ui/TextArea';
import { Button } from '../shared/ui/Button';
import { useScheduleMeeting } from '../../hooks/meetings/useScheduleMeeting';

interface MeetingSchedulerProps {
  caseId: string;
  onScheduled?: () => void;
}

export function MeetingScheduler({ caseId, onScheduled }: MeetingSchedulerProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60
  });

  const { scheduleMeeting, isScheduling } = useScheduleMeeting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;

    const scheduledFor = new Date(`${formData.date}T${formData.time}`);
    
    await scheduleMeeting({
      caseId,
      title: formData.title,
      description: formData.description,
      scheduledFor,
      durationMinutes: formData.duration
    });

    onScheduled?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Meeting Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        icon={<Video className="h-5 w-5 text-gray-400" />}
        required
      />

      <TextArea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Meeting agenda and details..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          required
          min={new Date().toISOString().split('T')[0]}
        />

        <Input
          type="time"
          label="Time"
          value={formData.time}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          icon={<Clock className="h-5 w-5 text-gray-400" />}
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          loading={isScheduling}
          disabled={!formData.title || !formData.date || !formData.time}
        >
          Schedule Meeting
        </Button>
      </div>
    </form>
  );
}
```