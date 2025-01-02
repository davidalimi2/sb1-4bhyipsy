import React from 'react';
import { CalendarEvent } from './CalendarEvent';
import type { CalendarEvent as CalendarEventType } from '../../types/calendar';

interface CalendarDayProps {
  date: Date;
  events: CalendarEventType[];
  isToday: boolean;
}

export function CalendarDay({ date, events, isToday }: CalendarDayProps) {
  return (
    <div className={`bg-white p-2 h-32 overflow-y-auto ${isToday ? 'ring-2 ring-indigo-600' : ''}`}>
      <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
        {date.getDate()}
      </div>
      <div className="mt-1 space-y-1">
        {events.map(event => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}