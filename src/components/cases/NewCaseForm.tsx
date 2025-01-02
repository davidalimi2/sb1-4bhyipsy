import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { useForm } from '../../hooks/useForm';
import type { NewCaseData } from '../../types/case';

interface NewCaseFormProps {
  onSubmit: (data: NewCaseData) => Promise<void>;
  isSubmitting?: boolean;
}

export function NewCaseForm({ onSubmit, isSubmitting }: NewCaseFormProps) {
  const navigate = useNavigate();
  const { formData, setFormData, handleSubmit } = useForm<NewCaseData>({
    initialData: {
      title: '',
      description: '',
      type: 'civil'
    },
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Case Title"
        required
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Enter a descriptive title for your case"
      />

      <Select
        label="Case Type"
        value={formData.type}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          type: e.target.value as NewCaseData['type']
        }))}
        required
      >
        <option value="civil">Civil Case</option>
        <option value="family">Family Law</option>
        <option value="small_claims">Small Claims</option>
      </Select>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Provide details about your case"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/cases')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          Create Case
        </Button>
      </div>
    </form>
  );
}