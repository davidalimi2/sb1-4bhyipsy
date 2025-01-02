import { FileText, Eye, Edit, Trash, GitBranch, Share, XCircle } from 'lucide-react';
import type { AuditAction, AuditEntry } from '../types/audit';

export function getAuditIcon(action: AuditAction) {
  const icons = {
    'document.create': FileText,
    'document.view': Eye,
    'document.edit': Edit,
    'document.delete': Trash,
    'version.create': GitBranch,
    'version.restore': GitBranch,
    'share.create': Share,
    'share.revoke': XCircle,
  };
  
  return icons[action];
}

export function getAuditDescription(entry: AuditEntry): string {
  const descriptions: Record<AuditAction, string> = {
    'document.create': 'Created document',
    'document.view': 'Viewed document',
    'document.edit': 'Modified document',
    'document.delete': 'Deleted document',
    'version.create': 'Created new version',
    'version.restore': 'Restored version',
    'share.create': 'Shared document',
    'share.revoke': 'Revoked share access',
  };
  
  return descriptions[entry.action];
}