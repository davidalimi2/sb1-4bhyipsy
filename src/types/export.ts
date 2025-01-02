export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'html';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includeComments?: boolean;
  watermark?: string;
  password?: string;
}

export interface ExportResult {
  id: string;
  url: string;
  format: ExportFormat;
  size: number;
  createdAt: Date;
  expiresAt: Date;
}