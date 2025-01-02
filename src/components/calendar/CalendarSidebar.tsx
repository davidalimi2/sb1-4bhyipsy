import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useUpcomingEvents } from '../../hooks/calendar/useUpcomingEvents';
import { UpcomingEventsList } from './UpcomingEventsList';
import { DocumentScanner } from './DocumentScanner';
import { NewEventModal } from './NewEventModal';

export function CalendarSidebar() {
  const { events, isLoading } = useUpcomingEvents();
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Event</h3>
        </div>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowNewEventModal(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          New Event
        </Button>
      </div>

      <DocumentScanner />

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        <UpcomingEventsList events={events} isLoading={isLoading} />
      </div>

      {showNewEventModal && (
        <NewEventModal onClose={() => setShowNewEventModal(false)} />
      )}
    </div>
  );
}