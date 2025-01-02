import { Plus } from 'lucide-react';
import { useTasks } from '../../hooks/tasks/useTasks';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import type { Task } from '../../types/task';

interface TaskListProps {
  caseId: string;
  onCreateTask?: () => void;
}

export function TaskList({ caseId, onCreateTask }: TaskListProps) {
  const { tasks, isLoading, updateTask, deleteTask } = useTasks(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <EmptyState
        title="No tasks"
        description="Create your first task to get started"
        action={{
          label: "Add Task",
          onClick: onCreateTask
        }}
      />
    );
  }

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await updateTask(taskId, { status });
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={(status) => handleStatusChange(task.id, status)}
          onDelete={() => handleDelete(task.id)}
        />
      ))}
    </div>
  );
}