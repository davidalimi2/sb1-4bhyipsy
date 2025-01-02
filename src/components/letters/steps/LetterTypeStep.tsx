import React from 'react';
import { Select } from '../../shared/ui/Select';
import { Input } from '../../shared/ui/Input';

interface LetterTypeStepProps {
  formData: any;
  onChange: (data: any) => void;
}

const LETTER_TYPES = [
  { value: 'demand', label: 'Demand Letter' },
  { value: 'cease_desist', label: 'Cease and Desist' },
  { value: 'settlement', label: 'Settlement Proposal' },
  { value: 'notice', label: 'Legal Notice' },
  { value: 'response', label: 'Response Letter' },
  { value: 'other', label: 'Other' }
];

export function LetterTypeStep({ formData, onChange }: LetterTypeStepProps) {
  return (
    <div className="space-y-6">
      <Select
        label="Letter Type"
        value={formData.type}
        onChange={(e) => onChange({ ...formData, type: e.target.value })}
        required
      >
        <option value="">Select letter type</option>
        {LETTER_TYPES.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </Select>

      {formData.type === 'other' && (
        <Input
          label="Custom Letter Type"
          value={formData.customType}
          onChange={(e) => onChange({ ...formData, customType: e.target.value })}
          placeholder="Enter the type of letter..."
          required
        />
      )}
    </div>
  );
}