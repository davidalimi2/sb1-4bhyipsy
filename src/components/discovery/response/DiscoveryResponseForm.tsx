import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import { FileUploadZone } from '../../documents/upload/FileUploadZone';
import { validateResponse } from '../../../utils/discoveryUtils';

interface DiscoveryResponseFormProps {
  discoveryId: string;
  onSubmit: (data: { content: string; documents: File[] }) => Promise<void>;
  isSubmitting?: boolean;
}

export function DiscoveryResponseForm({
  discoveryId,
  onSubmit,
  isSubmitting
}: DiscoveryResponseFormProps) {
  const [content, setContent] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateResponse(content, documents);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    await onSubmit({ content, documents });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextArea
        label="Response"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your response..."
        rows={8}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supporting Documents
        </label>
        <FileUploadZone
          onFileSelect={(file) => setDocuments(prev => [...prev, file])}
          onFileError={setError}
        />
        {documents.length > 0 && (
          <div className="mt-2 space-y-2">
            {documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setDocuments(prev => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!content.trim() || isSubmitting}
        >
          Submit Response
        </Button>
      </div>
    </form>
  );
}