import React from 'react';
import { getAuditIcon, getAuditDescription } from '../../utils/auditUtils';
import type { AuditEntry } from '../../types/audit';

interface AuditEntryItemProps {
  entry: AuditEntry;
}

export function AuditEntryItem({ entry }: AuditEntryItemProps) {
  const Icon = getAuditIcon(entry.action);
  
  return (
    <div className="relative flex space-x-3">
      <div>
        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
          <Icon className="h-5 w-5 text-gray-500" />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
        <div>
          <p className="text-sm text-gray-500">{getAuditDescription(entry)}</p>
          {entry.metadata && (
            <div className="mt-1 text-xs text-gray-500">
              {Object.entries(entry.metadata).map(([key, value]) => (
                <span key={key} className="mr-3">
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="whitespace-nowrap text-right text-sm text-gray-500">
          {new Date(entry.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}