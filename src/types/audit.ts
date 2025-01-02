export type AuditAction = 
  | 'document.create'
  | 'document.view' 
  | 'document.edit'
  | 'document.delete'
  | 'version.create'
  | 'version.restore'
  | 'share.create'
  | 'share.revoke';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  userId: string;
  resourceId: string;
  resourceType: 'document' | 'version' | 'share';
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}