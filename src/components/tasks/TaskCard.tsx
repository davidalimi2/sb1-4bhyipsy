import { Clock, Calendar, User, Tag } from 'lucide-react';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { formatDate } from '../../utils/date';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onDelete: () => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    overdue: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge className={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Due {formatDate(task.due_date)}
        </div>
        {task.assignee_id && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {task.assignee?.full_name}
          </div>
        )}
        {task.reminder_date && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Reminder: {formatDate(task.reminder_date)}
          </div>
        )}
      </div>

      {task.tags?.length > 0 && (
        <div className="mt-4 flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-3">
        <Select
          value={task.status}
          onChange={(e) => {
            const newStatus = e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled';
            onStatusChange(newStatus);
          }}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="overdue">Overdue</option>
        </Select>

        <Button
          variant="secondary"
          size="sm"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}