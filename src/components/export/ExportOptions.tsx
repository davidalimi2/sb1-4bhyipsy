import React from 'react';
import { Lock, Image, MessageSquare, Info } from 'lucide-react';
import type { ExportOptions as ExportOptionsType } from '../../types/export';

interface ExportOptionsProps {
  options: ExportOptionsType;
  onChange: (options: ExportOptionsType) => void;
}

export function ExportOptions({ options, onChange }: ExportOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="metadata"
          checked={options.includeMetadata}
          onChange={(e) => onChange({ ...options, includeMetadata: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="metadata" className="ml-2 flex items-center text-sm text-gray-700">
          <Info className="h-4 w-4 mr-1" />
          Include metadata
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="comments"
          checked={options.includeComments}
          onChange={(e) => onChange({ ...options, includeComments: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="comments" className="ml-2 flex items-center text-sm text-gray-700">
          <MessageSquare className="h-4 w-4 mr-1" />
          Include comments
        </label>
      </div>

      <div>
        <label htmlFor="watermark" className="flex items-center text-sm text-gray-700">
          <Image className="h-4 w-4 mr-1" />
          Watermark text (optional)
        </label>
        <input
          type="text"
          id="watermark"
          value={options.watermark || ''}
          onChange={(e) => onChange({ ...options, watermark: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="flex items-center text-sm text-gray-700">
          <Lock className="h-4 w-4 mr-1" />
          Password protection (optional)
        </label>
        <input
          type="password"
          id="password"
          value={options.password || ''}
          onChange={(e) => onChange({ ...options, password: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Leave blank for no password"
        />
      </div>
    </div>
  );
}