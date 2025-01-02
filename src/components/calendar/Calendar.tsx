import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useCalendarEvents } from '../../hooks/calendar/useCalendarEvents';
import { CalendarEvent } from './CalendarEvent';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, isLoading } = useCalendarEvents(currentDate);

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={prevMonth}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextMonth}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
      </div>

      <div className="p-4">
        <CalendarHeader />
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}