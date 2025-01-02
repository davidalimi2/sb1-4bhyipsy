```typescript
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

export interface Task {
  id: string;
  case_id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id?: string;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  reminder_date?: string;
  tags?: string[];
  attachments?: string[];
}

export interface NewTaskData {
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
  assignee_id?: string;
  reminder_date?: string;
  tags?: string[];
}
```