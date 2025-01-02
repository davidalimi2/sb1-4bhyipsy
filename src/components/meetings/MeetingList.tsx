```typescript
import React from 'react';
import { Video, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useMeetings } from '../../hooks/meetings/useMeetings';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { formatDateTime } from '../../utils/date';

interface MeetingListProps {
  caseId: string;
}

export function MeetingList({ caseId }: MeetingListProps) {
  const { meetings, isLoading, cancelMeeting } = useMeetings(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <EmptyState
        title="No meetings scheduled"
        description="Schedule a video meeting with your lawyer or client"
        action={{
          label: "Schedule Meeting",
          onClick: () => {/* Open scheduler */}
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{meeting.title}</h3>
              {meeting.description && (
                <p className="mt-1 text-sm text-gray-500">{meeting.description}</p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateTime(meeting.scheduled_for)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {meeting.duration_minutes} minutes
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                href={meeting.meeting_url}
                target="_blank"
                icon={<Video className="h-4 w-4" />}
              >
                Join
              </Button>
              {meeting.status === 'scheduled' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => cancelMeeting(meeting.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```