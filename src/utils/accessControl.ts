import type { ShareAccess, SharePermission } from '../types';

export function validateAccess(access: ShareAccess): boolean {
  if (!access) return false;
  
  // Check if access has expired
  if (access.expiresAt && new Date(access.expiresAt) < new Date()) {
    return false;
  }
  
  return true;
}

export function canPerformAction(
  access: ShareAccess,
  action: 'view' | 'edit' | 'download'
): boolean {
  if (!validateAccess(access)) return false;

  const permissionLevels: Record<SharePermission, string[]> = {
    view: ['view', 'download'],
    edit: ['view', 'edit', 'download'],
    restricted: ['view'],
  };

  return permissionLevels[access.permission].includes(action);
}