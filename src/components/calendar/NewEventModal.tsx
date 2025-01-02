import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { Button } from '../shared/ui/Button';
import { useActiveCases } from '../../hooks/cases/useActiveCases';
import { useCreateEvent } from '../../hooks/calendar/useCreateEvent';
import type { EventType, EventPriority } from '../../types/calendar';

interface NewEventModalProps {
  onClose: () => void;
}

export function NewEventModal({ onClose }: NewEventModalProps) {
  const { createEvent, isCreating } = useCreateEvent();
  const { cases } = useActiveCases();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'deadline' as EventType,
    priority: 'medium' as EventPriority,
    description: '',
    location: '',
    caseId: '' as string
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">New Event</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            type="datetime-local"
            label="Date & Time"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
            required
          >
            <option value="deadline">Deadline</option>
            <option value="hearing">Hearing</option>
            <option value="filing">Filing</option>
          </Select>

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as EventPriority })}
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Optional"
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional"
          />

          <Select
            label="Related Case"
            value={formData.caseId}
            onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
          >
            <option value="">Select a case</option>
            {cases?.map(caseData => (
              <option key={caseData.id} value={caseData.id}>
                {caseData.title}
              </option>
            ))}
          </Select>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isCreating}
              disabled={!formData.title || !formData.date}
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}