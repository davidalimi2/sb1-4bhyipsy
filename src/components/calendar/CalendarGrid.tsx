import React from 'react';
import { CalendarDay } from './CalendarDay';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { CalendarEvent } from '../../types/calendar';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
}

export function CalendarGrid({ currentDate, events, isLoading }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {/* Empty cells for days before the first of the month */}
      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div key={`empty-${index}`} className="bg-gray-50 h-32" />
      ))}

      {/* Calendar days */}
      {days.map(day => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === date.toDateString();
        });

        return (
          <CalendarDay
            key={day}
            date={date}
            events={dayEvents}
            isToday={date.toDateString() === new Date().toDateString()}
          />
        );
      })}
    </div>
  );
}