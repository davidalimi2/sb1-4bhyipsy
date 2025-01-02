import React, { useEffect } from 'react';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { TextArea } from '../../../shared/ui/TextArea';
import { CourtSelection } from './court-selection/CourtSelection';

interface InfoStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function InfoStep({ formData, onChange }: InfoStepProps) {
  return (
    <div className="space-y-6">
      <Select
        label="Type of Lawsuit"
        value={formData.type}
        onChange={(e) => onChange({ ...formData, type: e.target.value })}
        required
      >
        <option value="">Select type</option>
        <option value="complaint">Complaint</option>
        <option value="counterclaim">Counterclaim</option>
        <option value="motion">Motion</option>
        <option value="brief">Brief</option>
      </Select>

      <CourtSelection
        formData={formData}
        onChange={onChange}
      />

      <TextArea
        label="Case Summary"
        value={formData.summary}
        onChange={(e) => onChange({ ...formData, summary: e.target.value })}
        placeholder="Briefly describe what this case is about..."
        rows={4}
      />
    </div>
  );
}