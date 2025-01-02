import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  type: 'deadline' | 'hearing' | 'filing';
  caseId: string;
  caseName: string;
}

export function UpcomingTasks() {
  // Mock data - will be replaced with actual data from API
  const tasks: Task[] = [
    {
      id: '1',
      title: 'File Response to Motion',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high',
      type: 'filing',
      caseId: '1',
      caseName: 'Smith vs. Johnson'
    },
    {
      id: '2',
      title: 'Court Hearing',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'high',
      type: 'hearing',
      caseId: '2',
      caseName: 'Property Dispute'
    }
  ];

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const getTypeIcon = (type: Task['type']) => {
    const icons = {
      deadline: Clock,
      hearing: AlertCircle,
      filing: Calendar
    };
    return icons[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Upcoming Tasks</h2>

      <div className="space-y-4">
        {tasks.map(task => {
          const Icon = getTypeIcon(task.type);
          
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.caseName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-sm text-gray-500">
                  Due {task.dueDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <a
          href="/tasks"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all tasks →
        </a>
      </div>
    </div>
  );
}