import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { Button } from '../shared/ui/Button';
import { Dialog } from '../shared/ui/Dialog';

interface TaskManagerProps {
  caseId: string;
}

export function TaskManager({ caseId }: TaskManagerProps) {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Tasks & Deadlines</h2>
        <Button
          onClick={() => setShowNewTaskForm(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Task
        </Button>
      </div>

      <TaskList
        caseId={caseId}
        onCreateTask={() => setShowNewTaskForm(true)}
      />

      <Dialog
        open={showNewTaskForm}
        onClose={() => setShowNewTaskForm(false)}
        title="Create New Task"
      >
        <TaskForm
          caseId={caseId}
          onSuccess={() => setShowNewTaskForm(false)}
          onCancel={() => setShowNewTaskForm(false)}
        />
      </Dialog>
    </div>
  );
}