import { 
  Edit, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send, 
  Eye 
} from 'lucide-react';
import type { WorkflowStatus, WorkflowAction } from '../types/workflow';

export function getWorkflowStatusIcon(status: WorkflowStatus) {
  const icons = {
    draft: Edit,
    pending_review: Clock,
    in_review: Eye,
    approved: CheckCircle,
    rejected: XCircle,
    final: Send
  };
  
  return icons[status];
}

export function getWorkflowStatusColor(status: WorkflowStatus) {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    in_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    final: 'bg-purple-100 text-purple-800'
  };
  
  return colors[status];
}

export function canPerformAction(
  currentStatus: WorkflowStatus,
  action: WorkflowAction,
  userRole: string
): boolean {
  // Define allowed transitions based on status and user role
  const allowedTransitions: Record<WorkflowStatus, Record<string, WorkflowAction[]>> = {
    draft: {
      author: ['submit'],
      reviewer: [],
      admin: ['submit', 'approve']
    },
    pending_review: {
      author: [],
      reviewer: ['review'],
      admin: ['review', 'approve', 'reject']
    },
    in_review: {
      author: [],
      reviewer: ['approve', 'reject'],
      admin: ['approve', 'reject']
    },
    approved: {
      author: ['finalize'],
      reviewer: [],
      admin: ['finalize', 'reject']
    },
    rejected: {
      author: ['revise'],
      reviewer: [],
      admin: ['revise', 'approve']
    },
    final: {
      author: [],
      reviewer: [],
      admin: []
    }
  };

  return allowedTransitions[currentStatus][userRole]?.includes(action) || false;
}