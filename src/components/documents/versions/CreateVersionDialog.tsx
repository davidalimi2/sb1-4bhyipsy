import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Input, Button } from '../../shared/ui';
import { useCreateVersion } from '../../../hooks/useCreateVersion';
import type { Document } from '../../../types/document';

interface CreateVersionDialogProps {
  document: Document;
  onClose: () => void;
}

export function CreateVersionDialog({ document, onClose }: CreateVersionDialogProps) {
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { createVersion, isCreating } = useCreateVersion();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    await createVersion({
      document,
      file: selectedFile,
      comment: comment.trim() || undefined,
      onSuccess: onClose
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Create New Version</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center
                ${selectedFile ? 'border-indigo-300' : 'border-gray-300'}
                hover:border-indigo-300
              `}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {!selectedFile ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your file here, or{' '}
                    <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <Input
              label="Version Comment (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the changes in this version"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isCreating}
                disabled={!selectedFile}
              >
                Create Version
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}