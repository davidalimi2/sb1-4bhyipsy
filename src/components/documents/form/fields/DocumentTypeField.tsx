import React from 'react';
import { getDocumentTypeLabel } from '../../../../utils/documentUtils';
import type { Document } from '../../../../types';

interface DocumentTypeFieldProps {
  value: Document['type'];
  onChange: (value: Document['type']) => void;
}

export function DocumentTypeField({ value, onChange }: DocumentTypeFieldProps) {
  return (
    <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
        Document Type
      </label>
      <select
        id="type"
        value={value}
        onChange={(e) => onChange(e.target.value as Document['type'])}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {(['template', 'filing', 'evidence'] as const).map((type) => (
          <option key={type} value={type}>
            {getDocumentTypeLabel(type)}
          </option>
        ))}
      </select>
    </div>
  );
}