```typescript
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useFileUpload } from '../../../hooks/documents/useFileUpload';
import { validateFile } from '../../../utils/fileUtils';

interface LawsuitUploaderProps {
  onUpload: (file: File) => Promise<void>;
}

export function LawsuitUploader({ onUpload }: LawsuitUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { selectedFile, handleFileSelect, handleDrop } = useFileUpload({
    allowedTypes: ['application/pdf', 'image/png', 'image/jpeg']
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      await onUpload(selectedFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 
          ${selectedFile ? 'border-indigo-300' : 'border-gray-300'}
          hover:border-indigo-400 transition-colors
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Upload a lawsuit document to analyze
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PDF, PNG, or JPEG files up to 10MB
          </p>
          
          <div className="mt-4">
            <input
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg"
              id="lawsuit-upload"
            />
            <label
              htmlFor="lawsuit-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              Select File
            </label>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            loading={isUploading}
          >
            Analyze Document
          </Button>
        </div>
      )}
    </div>
  );
}
```