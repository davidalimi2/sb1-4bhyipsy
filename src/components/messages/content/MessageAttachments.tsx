```typescript
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { formatFileSize } from '../../../utils/format';
import type { MessageAttachment } from '../../../types/message';

interface MessageAttachmentsProps {
  attachments: MessageAttachment[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  if (!attachments.length) return null;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
      <div className="space-y-2">
        {attachments.map(attachment => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
              </div>
            </div>
            <button
              onClick={() => window.open(attachment.url, '_blank')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```