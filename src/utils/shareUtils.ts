import type { SharePermission } from '../types';

export function generateShareLink(documentId: string, permission: SharePermission): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/documents/shared/${documentId}?permission=${permission}`;
}

export function validateSharePermission(permission: string): permission is SharePermission {
  return ['view', 'edit', 'restricted'].includes(permission);
}

export function canShareDocument(permission: SharePermission): boolean {
  return permission !== 'restricted';
}