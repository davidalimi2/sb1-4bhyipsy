```typescript
import React from 'react';
import { Input } from '../../shared/ui/Input';
import { CategorySelect } from '../CategorySelect';
import { ImportanceSelect } from './ImportanceSelect';
import type { Question } from '../../../types/deposition';

interface QuestionFieldsProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

export function QuestionFields({ question, onUpdate }: QuestionFieldsProps) {
  return (
    <div className="space-y-4">
      <Input
        value={question.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter question"
      />
      <div className="flex space-x-4">
        <CategorySelect
          value={question.category}
          onChange={(category) => onUpdate({ category })}
          className="w-1/2"
        />
        <ImportanceSelect
          value={question.importance}
          onChange={(importance) => onUpdate({ importance })}
          className="w-1/2"
        />
      </div>
      {question.notes && (
        <Input
          value={question.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Add notes"
        />
      )}
    </div>
  );
}
```