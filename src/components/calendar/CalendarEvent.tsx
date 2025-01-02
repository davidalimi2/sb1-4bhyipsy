import React from 'react';
import { Clock, FileText, Users } from 'lucide-react';
import type { CalendarEvent as CalendarEventType } from '../../types/calendar';

interface CalendarEventProps {
  event: CalendarEventType;
}

export function CalendarEvent({ event }: CalendarEventProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'hearing':
        return <Users className="h-4 w-4" />;
      case 'filing':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = () => {
    switch (event.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  return (
    <div
      className={`
        flex flex-col p-1 rounded text-xs cursor-pointer
        ${getEventColor()}
      `}
      onClick={() => window.location.href = `/cases/${event.caseId}`}
    >
      <div className="flex items-center">
        <span className="mr-1">{getEventIcon()}</span>
        <span className="truncate">{event.title}</span>
      </div>
      {event.caseId && (
        <div className="mt-1 text-xs opacity-75 truncate">
          📁 {event.caseName}
        </div>
      )}
    </div>
  );
}