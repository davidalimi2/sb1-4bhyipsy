import React from 'react';
import { Eye, Edit2, Lock } from 'lucide-react';
import type { SharePermission } from '../../../types';

interface SharePermissionSelectProps {
  value: SharePermission;
  onChange: (value: SharePermission) => void;
}

export function SharePermissionSelect({ value, onChange }: SharePermissionSelectProps) {
  const permissions = [
    { value: 'view', label: 'Can view', icon: Eye },
    { value: 'edit', label: 'Can edit', icon: Edit2 },
    { value: 'restricted', label: 'Restricted', icon: Lock },
  ] as const;

  return (
    <div className="flex space-x-2">
      {permissions.map(({ value: permValue, label, icon: Icon }) => (
        <button
          key={permValue}
          onClick={() => onChange(permValue)}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm ${
            value === permValue
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Icon className="h-4 w-4 mr-1.5" />
          {label}
        </button>
      ))}
    </div>
  );
}