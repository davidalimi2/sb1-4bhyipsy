import React, { useState } from 'react';
import { X, Download, Lock, Image, FileText } from 'lucide-react';
import { ExportFormatSelect } from './ExportFormatSelect';
import { ExportOptions } from './ExportOptions';
import type { ExportOptions as ExportOptionsType } from '../../types/export';

interface ExportDialogProps {
  onExport: (options: ExportOptionsType) => Promise<void>;
  onClose: () => void;
}

export function ExportDialog({ onExport, onClose }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptionsType>({
    format: 'pdf',
    includeMetadata: true,
    includeComments: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onExport(options);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Export Document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <ExportFormatSelect
            value={options.format}
            onChange={(format) => setOptions({ ...options, format })}
          />
          
          <ExportOptions
            options={options}
            onChange={setOptions}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}