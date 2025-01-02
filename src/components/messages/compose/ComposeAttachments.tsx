import { Paperclip, X } from 'lucide-react';
import { formatFileSize } from '../../../utils/format';

interface ComposeAttachmentsProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function ComposeAttachments({ files, onRemove }: ComposeAttachmentsProps) {
  if (!files.length) return null;

  return (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}