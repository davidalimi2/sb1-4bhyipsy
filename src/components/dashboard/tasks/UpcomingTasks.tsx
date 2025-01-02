import React from 'react';
import { Clock, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { useTasks } from '../../../hooks/useTasks';

export function UpcomingTasks() {
  const { tasks, isLoading } = useTasks();
  const upcomingTasks = tasks?.slice(0, 5);

  return (
    <Card>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Upcoming Tasks</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingTasks?.map(task => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {task.type === 'deadline' ? (
                    <Clock className="h-5 w-5 text-gray-600" />
                  ) : task.type === 'hearing' ? (
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Calendar className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.caseName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge
                  variant={
                    task.priority === 'high' ? 'error' :
                    task.priority === 'medium' ? 'warning' :
                    'default'
                  }
                >
                  {task.priority}
                </Badge>
                <span className="text-sm text-gray-500">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/tasks"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all tasks →
        </a>
      </div>
    </Card>
  );
}