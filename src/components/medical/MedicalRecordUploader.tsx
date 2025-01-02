import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useFileUpload } from '../../hooks/documents/useFileUpload';

interface MedicalRecordUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
}

export function MedicalRecordUploader({ onUpload }: MedicalRecordUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { selectedFiles, handleFileSelect, handleDrop } = useFileUpload({
    allowedTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    multiple: true
  });

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    
    try {
      setIsUploading(true);
      await onUpload(selectedFiles);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 
          ${selectedFiles.length ? 'border-indigo-300' : 'border-gray-300'}
          hover:border-indigo-400 transition-colors
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Upload medical records to analyze
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PDF, PNG, or JPEG files up to 10MB each
          </p>
          
          <div className="mt-4">
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              id="medical-records-upload"
            />
            <label
              htmlFor="medical-records-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              Select Files
            </label>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Selected Files ({selectedFiles.length})
          </h4>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{file.name}</span>
                </div>
                <span className="text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4">
            <Button
              onClick={handleUpload}
              loading={isUploading}
              fullWidth
            >
              Analyze Records
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}