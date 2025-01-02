import { FileText, Download } from 'lucide-react';
import { formatFileSize } from '../../../utils/format';
import type { MessageAttachment } from '../../../types/message';

interface AttachmentListProps {
  attachments: MessageAttachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <div className="text-sm font-medium">{attachment.name}</div>
              <div className="text-xs text-gray-500">
                {formatFileSize(attachment.size)}
              </div>
            </div>
          </div>
          <a
            href={attachment.url}
            download
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  );
}