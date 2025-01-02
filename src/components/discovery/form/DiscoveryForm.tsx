import { useState } from 'react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import type { Discovery } from '../../../types/discovery';

interface DiscoveryFormProps {
  caseId: string;
  onSubmit: (data: Omit<Discovery, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isSubmitting?: boolean;
}

export function DiscoveryForm({ caseId, onSubmit, isSubmitting }: DiscoveryFormProps) {
  const [formData, setFormData] = useState({
    type: 'document_request' as Discovery['type'],
    description: '',
    party: '',
    due_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.due_date) return;

    await onSubmit({
      ...formData,
      case_id: caseId,
      status: 'pending'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Request Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as Discovery['type'] })}
        required
      >
        <option value="document_request">Document Request</option>
        <option value="interrogatory">Interrogatory</option>
        <option value="admission_request">Request for Admission</option>
        <option value="deposition_notice">Deposition Notice</option>
      </Select>

      <TextArea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter the details of your discovery request"
        required
        rows={4}
      />

      <Input
        label="Responding Party"
        value={formData.party}
        onChange={(e) => setFormData({ ...formData, party: e.target.value })}
        placeholder="Enter the name of the responding party"
      />

      <Input
        type="date"
        label="Due Date"
        value={formData.due_date}
        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        required
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.description || !formData.due_date}
        >
          Create Request
        </Button>
      </div>
    </form>
  );
}