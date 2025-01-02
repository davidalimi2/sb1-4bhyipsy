import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useScheduledMessages } from '../../../hooks/messages/useScheduledMessages';

interface ScheduleButtonProps {
  messageId: string;
  onScheduled?: () => void;
}

export function ScheduleButton({ messageId, onScheduled }: ScheduleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { scheduleMessage } = useScheduledMessages();

  const handleSchedule = async () => {
    if (!selectedDate) return;
    
    await scheduleMessage(messageId, selectedDate);
    setIsOpen(false);
    onScheduled?.();
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        icon={<Calendar className="h-4 w-4" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Schedule
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-md"
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              min={new Date().toISOString().slice(0, 16)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSchedule}
                disabled={!selectedDate}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}