export type WorkflowStatus = 
  | 'draft'
  | 'pending_review'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'final';

export type WorkflowAction =
  | 'submit'
  | 'review'
  | 'approve'
  | 'reject'
  | 'revise'
  | 'finalize';

export interface WorkflowStep {
  id: string;
  documentId: string;
  status: WorkflowStatus;
  action: WorkflowAction;
  assignedTo?: string;
  completedBy?: string;
  comments?: string;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}