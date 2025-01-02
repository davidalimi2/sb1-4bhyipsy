import React from 'react';
import { Calendar } from '../components/calendar/Calendar';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';

export function CalendarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Calendar />
        </div>
        <div>
          <CalendarSidebar />
        </div>
      </div>
    </div>
  );
}