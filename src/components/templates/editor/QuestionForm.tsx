import React from 'react';
import { Trash } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Switch } from '../../shared/ui/Switch';
import { Button } from '../../shared/ui/Button';
import type { TemplateQuestion } from '../../../types/template';

interface QuestionFormProps {
  question: TemplateQuestion;
  onChange: (updates: Partial<TemplateQuestion>) => void;
}

export function QuestionForm({ question, onChange }: QuestionFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Question Text"
        value={question.text}
        onChange={(e) => onChange({ text: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Question Type"
          value={question.type}
          onChange={(e) => onChange({ type: e.target.value as TemplateQuestion['type'] })}
          required
        >
          <option value="text">Text</option>
          <option value="select">Select</option>
          <option value="date">Date</option>
          <option value="number">Number</option>
          <option value="boolean">Yes/No</option>
        </Select>

        <div className="flex items-center space-x-2 pt-7">
          <Switch
            checked={question.required}
            onChange={(checked) => onChange({ required: checked })}
          />
          <span className="text-sm text-gray-700">Required</span>
        </div>
      </div>

      {question.type === 'select' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options
          </label>
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[index] = e.target.value;
                    onChange({ options: newOptions });
                  }}
                />
                <button
                  onClick={() => {
                    const newOptions = [...(question.options || [])];
                    newOptions.splice(index, 1);
                    onChange({ options: newOptions });
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => onChange({
                options: [...(question.options || []), '']
              })}
            >
              Add Option
            </Button>
          </div>
        </div>
      )}

      <Input
        label="Help Text (Optional)"
        value={question.helpText || ''}
        onChange={(e) => onChange({ helpText: e.target.value })}
        placeholder="Add helpful instructions or context"
      />
    </div>
  );
}