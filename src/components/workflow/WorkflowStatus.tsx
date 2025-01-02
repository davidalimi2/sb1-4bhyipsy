import React from 'react';
import { getWorkflowStatusIcon, getWorkflowStatusColor } from '../../utils/workflowUtils';
import type { WorkflowStatus as Status } from '../../types/workflow';

interface WorkflowStatusProps {
  status: Status;
  className?: string;
}

export function WorkflowStatus({ status, className = '' }: WorkflowStatusProps) {
  const Icon = getWorkflowStatusIcon(status);
  const colors = getWorkflowStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors} ${className}`}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {status.replace('_', ' ')}
    </span>
  );
}