```typescript
import React from 'react';
import { Select } from '../../shared/ui/Select';
import type { Question } from '../../../types/deposition';

interface ImportanceSelectProps {
  value: Question['importance'];
  onChange: (importance: Question['importance']) => void;
  className?: string;
}

export function ImportanceSelect({ value, onChange, className }: ImportanceSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as Question['importance'])}
      className={className}
    >
      <option value="high">High Priority</option>
      <option value="medium">Medium Priority</option>
      <option value="low">Low Priority</option>
    </Select>
  );
}
```