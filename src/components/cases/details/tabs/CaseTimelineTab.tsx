import React from 'react';
import { Clock } from 'lucide-react';
import type { TimelineEvent } from '../../../../types';

interface CaseTimelineTabProps {
  events: TimelineEvent[];
}

export function CaseTimelineTab({ events }: CaseTimelineTabProps) {
  if (!events.length) {
    return (
      <div className="text-center py-6">
        <Clock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
        <p className="mt-1 text-sm text-gray-500">Events will appear here as they occur.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {idx !== events.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
              )}
              <div className="relative flex space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">{event.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}