```typescript
import React from 'react';
import { Select } from '../shared/ui/Select';
import { QUESTION_CATEGORIES, QuestionCategory } from '../../utils/questionCategories';

interface CategorySelectProps {
  value: QuestionCategory;
  onChange: (category: QuestionCategory) => void;
  className?: string;
}

export function CategorySelect({ value, onChange, className }: CategorySelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionCategory)}
      className={className}
    >
      {Object.entries(QUESTION_CATEGORIES).map(([key, { label }]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </Select>
  );
}
```