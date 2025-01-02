import React from 'react';
import { Send, CheckCircle, XCircle, Edit, Eye } from 'lucide-react';
import { canPerformAction } from '../../utils/workflowUtils';
import type { WorkflowStatus, WorkflowAction } from '../../types/workflow';

interface WorkflowActionsProps {
  status: WorkflowStatus;
  userRole: string;
  onAction: (action: WorkflowAction) => void;
}

export function WorkflowActions({ status, userRole, onAction }: WorkflowActionsProps) {
  const actions: Array<{ action: WorkflowAction; label: string; icon: any }> = [
    { action: 'submit', label: 'Submit for Review', icon: Send },
    { action: 'review', label: 'Start Review', icon: Eye },
    { action: 'approve', label: 'Approve', icon: CheckCircle },
    { action: 'reject', label: 'Reject', icon: XCircle },
    { action: 'revise', label: 'Revise', icon: Edit },
    { action: 'finalize', label: 'Finalize', icon: Send }
  ];

  const availableActions = actions.filter(({ action }) => 
    canPerformAction(status, action, userRole)
  );

  if (!availableActions.length) {
    return null;
  }

  return (
    <div className="flex space-x-3">
      {availableActions.map(({ action, label, icon: Icon }) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Icon className="h-4 w-4 mr-1.5" />
          {label}
        </button>
      ))}
    </div>
  );
}