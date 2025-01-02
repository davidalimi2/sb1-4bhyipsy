import React from 'react';

interface DocumentTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DocumentTitleField({ value, onChange }: DocumentTitleFieldProps) {
  return (
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
        Document Title
      </label>
      <input
        type="text"
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      />
    </div>
  );
}