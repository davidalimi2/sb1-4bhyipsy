// Add to existing types
export interface ShareAnalytics {
  id: string;
  documentId: string;
  shareId: string;
  accessedBy: string;
  accessedAt: Date;
  accessType: 'view' | 'edit' | 'download';
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

export interface BatchShareRequest {
  documentIds: string[];
  recipients: string[];
  permission: SharePermission;
  message?: string;
  expiresAt?: Date;
}