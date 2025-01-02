import React from 'react';
import { FileText, FileImage, FileCode } from 'lucide-react';
import type { ExportFormat } from '../../types/export';

interface ExportFormatSelectProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

export function ExportFormatSelect({ value, onChange }: ExportFormatSelectProps) {
  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'docx', label: 'Word Document', icon: FileText },
    { value: 'txt', label: 'Plain Text', icon: FileText },
    { value: 'html', label: 'HTML', icon: FileCode },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3">
      {formats.map(({ value: format, label, icon: Icon }) => (
        <button
          key={format}
          type="button"
          onClick={() => onChange(format)}
          className={`flex items-center p-3 border rounded-lg ${
            value === format
              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Icon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}