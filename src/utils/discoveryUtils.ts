import { FileText, FileQuestion, FileCheck, Users } from 'lucide-react';
import type { DiscoveryType, DiscoveryResponse } from '../types/discovery';

export function getDiscoveryTypeIcon(type: DiscoveryType) {
  const icons = {
    interrogatory: FileQuestion,
    document_request: FileText,
    admission_request: FileCheck,
    deposition_notice: Users
  };
  
  return icons[type];
}

export function getDiscoveryTypeLabel(type: DiscoveryType): string {
  const labels: Record<DiscoveryType, string> = {
    interrogatory: 'Interrogatory',
    document_request: 'Request for Production',
    admission_request: 'Request for Admission',
    deposition_notice: 'Notice of Deposition'
  };
  
  return labels[type];
}

export function validateResponse(content: string, documents: File[]): { valid: boolean; error?: string } {
  if (!content.trim()) {
    return { valid: false, error: 'Response content is required' };
  }

  if (documents.length > 10) {
    return { valid: false, error: 'Maximum 10 documents allowed' };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  const oversizedFiles = documents.filter(file => file.size > maxSize);
  if (oversizedFiles.length) {
    return { valid: false, error: 'Some files exceed the maximum size of 10MB' };
  }

  return { valid: true };
}

export function formatResponsePreview(response: DiscoveryResponse): string {
  const preview = response.content.slice(0, 200);
  return preview.length < response.content.length ? preview + '...' : preview;
}