import React from 'react';
import { Clock } from 'lucide-react';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { CalendarEvent } from '../../types/calendar';

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  isLoading: boolean;
}

export function UpcomingEventsList({ events, isLoading }: UpcomingEventsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-center py-4">
        <Clock className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div
          key={event.id}
          className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => window.location.href = `/cases/${event.caseId}`}
        >
          <div className={`
            flex-shrink-0 w-2 h-2 mt-2 rounded-full
            ${event.priority === 'high' ? 'bg-red-500' :
              event.priority === 'medium' ? 'bg-yellow-500' :
              'bg-blue-500'}
          `} />
          <div>
            <p className="text-sm font-medium text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(event.date).toLocaleDateString()}
            </p>
            {event.location && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {event.location}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}