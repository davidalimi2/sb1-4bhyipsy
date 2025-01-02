import React from 'react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { TextArea } from '../../shared/ui/TextArea';
import type { Template, TemplateCategory } from '../../../types/template';

interface TemplateBasicInfoProps {
  template: Partial<Template>;
  onChange: (updates: Partial<Template>) => void;
}

export function TemplateBasicInfo({ template, onChange }: TemplateBasicInfoProps) {
  return (
    <div className="space-y-6">
      <Input
        label="Template Title"
        value={template.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        required
        placeholder="Enter a descriptive title"
      />

      <Select
        label="Category"
        value={template.category || ''}
        onChange={(e) => onChange({ category: e.target.value as TemplateCategory })}
        required
      >
        <option value="">Select a category</option>
        <option value="lawsuit">Lawsuit</option>
        <option value="contract">Contract</option>
        <option value="motion">Motion</option>
        <option value="response">Response</option>
      </Select>

      <TextArea
        label="Description"
        value={template.description || ''}
        onChange={(e) => onChange({ description: e.target.value })}
        required
        placeholder="Describe the purpose and use case of this template"
        rows={4}
      />

      <Select
        label="Jurisdiction"
        value={template.jurisdiction || ''}
        onChange={(e) => onChange({ jurisdiction: e.target.value })}
      >
        <option value="">Select jurisdiction (optional)</option>
        <option value="federal">Federal</option>
        <option value="state">State</option>
      </Select>
    </div>
  );
}