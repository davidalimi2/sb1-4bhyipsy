export const SUPPORTED_MIME_TYPES = {
  'application/pdf': {
    extensions: ['.pdf'],
    label: 'PDF Document'
  },
  'application/msword': {
    extensions: ['.doc'],
    label: 'Word Document'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    extensions: ['.docx'],
    label: 'Word Document'
  },
  'text/plain': {
    extensions: ['.txt'],
    label: 'Text Document'
  }
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  for (const [mimeType, { extensions }] of Object.entries(SUPPORTED_MIME_TYPES)) {
    if (extensions.includes(`.${ext}`)) {
      return mimeType;
    }
  }
  
  return 'application/octet-stream';
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  // Check file type
  const mimeType = getMimeType(file.name);
  if (!SUPPORTED_MIME_TYPES[mimeType as keyof typeof SUPPORTED_MIME_TYPES]) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.'
    };
  }

  return { valid: true };
}

export function getFileTypeLabel(mimeType: string): string {
  return SUPPORTED_MIME_TYPES[mimeType as keyof typeof SUPPORTED_MIME_TYPES]?.label || 'Unknown';
}