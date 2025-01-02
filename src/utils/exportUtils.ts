import type { ExportFormat, ExportResult } from '../types/export';

export function getExportFormatIcon(format: ExportFormat) {
  const icons = {
    pdf: 'file-text',
    docx: 'file-text',
    txt: 'file-text',
    html: 'code'
  };
  
  return icons[format];
}

export function formatExportSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function getExportExpiration(result: ExportResult): string {
  const now = new Date();
  const expiresAt = new Date(result.expiresAt);
  const hours = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  return `Expires in ${hours} hours`;
}