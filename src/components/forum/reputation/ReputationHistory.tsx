import React from 'react';
import { Activity } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { ReputationEvent } from '../../../types/forum';

interface ReputationHistoryProps {
  events: ReputationEvent[];
}

export function ReputationHistory({ events }: ReputationHistoryProps) {
  if (!events.length) {
    return (
      <div className="text-center py-6">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reputation activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start participating in the community to earn reputation points
        </p>
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
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {event.event_type.replace('_', ' ')} (+{event.points} points)
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDateTime(event.created_at)}
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