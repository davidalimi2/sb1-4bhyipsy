import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface DocumentUploadFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function DocumentUploadField({ value, onChange }: DocumentUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Document File</label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file);
                }}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {value && <p className="text-sm text-gray-500">{value.name}</p>}
        </div>
      </div>
    </div>
  );
}