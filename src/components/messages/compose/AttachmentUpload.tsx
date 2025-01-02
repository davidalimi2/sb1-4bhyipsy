import { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useNotifications } from '../../../hooks/useNotifications';
import { validateFile } from '../../../utils/fileUtils';

interface AttachmentUploadProps {
  onSelect: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

export function AttachmentUpload({
  onSelect,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false
}: AttachmentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check total files
    if (files.length > maxFiles) {
      addNotification({
        type: 'error',
        title: 'Too many files',
        message: `Maximum ${maxFiles} files allowed`
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      const { valid, error } = validateFile(file);
      if (!valid) {
        addNotification({
          type: 'error',
          title: 'Invalid file',
          message: error || `${file.name} is not valid`
        });
      }
      return valid;
    });

    if (validFiles.length) {
      onSelect(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        icon={<Paperclip className="h-4 w-4" />}
        disabled={disabled}
      >
        Attach Files
      </Button>
      <p className="mt-1 text-xs text-gray-500">
        Max {maxFiles} files, up to {maxSize / (1024 * 1024)}MB each
      </p>
    </div>
  );
}