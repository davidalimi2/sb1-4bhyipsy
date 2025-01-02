import React from 'react';
import { Upload, X } from 'lucide-react';
import { useFileUpload } from '../../../hooks/documents/useFileUpload';
import { formatFileSize } from '../../../utils/format';
import { SUPPORTED_MIME_TYPES } from '../../../utils/fileTypes';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onFileError?: (error: string) => void;
}

export function FileUploadZone({ onFileSelect, onFileError }: FileUploadZoneProps) {
  const {
    selectedFile,
    isDragging,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    reset
  } = useFileUpload({
    onSuccess: onFileSelect,
    onError: onFileError
  });

  const supportedTypes = Object.values(SUPPORTED_MIME_TYPES)
    .map(({ label }) => label)
    .join(', ');

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 transition-colors
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
        ${selectedFile ? 'bg-gray-50' : ''}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {!selectedFile ? (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your file here, or{' '}
            <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
              browse
              <input
                type="file"
                className="sr-only"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                accept={Object.values(SUPPORTED_MIME_TYPES)
                  .flatMap(({ extensions }) => extensions)
                  .join(',')}
              />
            </label>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: {supportedTypes}
            <br />
            Maximum file size: 10MB
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}