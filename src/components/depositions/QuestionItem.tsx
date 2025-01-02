import React from 'react';
import { GripVertical, Trash } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { Button } from '../shared/ui/Button';
import type { Question } from '../../types/deposition';

interface QuestionItemProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export function QuestionItem({
  question,
  onUpdate,
  onRemove,
  dragHandleProps
}: QuestionItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start space-x-4">
        <div {...dragHandleProps} className="mt-2 cursor-move">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 space-y-4">
          <Input
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Enter question"
          />
          <div className="flex space-x-4">
            <Select
              value={question.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="w-1/2"
            >
              <option value="background">Background</option>
              <option value="qualifications">Qualifications</option>
              <option value="knowledge">Knowledge</option>
              <option value="events">Events</option>
              <option value="opinions">Opinions</option>
            </Select>
            <Select
              value={question.importance}
              onChange={(e) => onUpdate({ importance: e.target.value as any })}
              className="w-1/2"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </div>
          {question.notes && (
            <Input
              value={question.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Add notes"
            />
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Trash className="h-4 w-4" />}
          onClick={onRemove}
        />
      </div>
    </div>
  );
}