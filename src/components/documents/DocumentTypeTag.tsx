import React from 'react';
import { FileText, FileImage, FileCode } from 'lucide-react';

interface DocumentTypeTagProps {
  mimeType: string;
}

export function DocumentTypeTag({ mimeType }: DocumentTypeTagProps) {
  const getTypeInfo = (mimeType: string) => {
    switch (mimeType) {
      case 'application/pdf':
        return {
          label: 'PDF',
          icon: FileText,
          className: 'bg-red-50 text-red-700'
        };
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return {
          label: 'DOC',
          icon: FileText,
          className: 'bg-blue-50 text-blue-700'
        };
      case 'text/plain':
        return {
          label: 'TXT',
          icon: FileCode,
          className: 'bg-gray-50 text-gray-700'
        };
      case 'image/jpeg':
      case 'image/png':
        return {
          label: 'IMG',
          icon: FileImage,
          className: 'bg-purple-50 text-purple-700'
        };
      default:
        return {
          label: 'FILE',
          icon: FileText,
          className: 'bg-gray-50 text-gray-700'
        };
    }
  };

  const { label, icon: Icon, className } = getTypeInfo(mimeType);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </span>
  );
}