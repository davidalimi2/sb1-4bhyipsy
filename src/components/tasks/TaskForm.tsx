import { useState } from 'react';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { TextArea } from '../shared/ui/TextArea';
import { Button } from '../shared/ui/Button';
import { useTasks } from '../../hooks/tasks/useTasks';
import type { NewTaskData } from '../../types/task';

interface TaskFormProps {
  caseId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({ caseId, onSuccess, onCancel }: TaskFormProps) {
  const { createTask } = useTasks(caseId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewTaskData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    reminder_date: '',
    tags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.due_date) return;

    setIsSubmitting(true);
    try {
      await createTask({
        ...formData,
        case_id: caseId,
        status: 'pending'
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <TextArea
        label="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Due Date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          required
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
          required
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      <Input
        type="date"
        label="Reminder Date (Optional)"
        value={formData.reminder_date || ''}
        onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.title || !formData.due_date}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}