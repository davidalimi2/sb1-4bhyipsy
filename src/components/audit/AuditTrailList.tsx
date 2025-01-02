import React from 'react';
import { Activity } from 'lucide-react';
import { AuditEntryItem } from './AuditEntryItem';
import type { AuditEntry } from '../../types/audit';

interface AuditTrailListProps {
  entries: AuditEntry[];
}

export function AuditTrailList({ entries }: AuditTrailListProps) {
  if (!entries.length) {
    return (
      <div className="text-center py-6">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
        <p className="mt-1 text-sm text-gray-500">Activity will be recorded here.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {entries.map((entry, idx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {idx !== entries.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <AuditEntryItem entry={entry} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}