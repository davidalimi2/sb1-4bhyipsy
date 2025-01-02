```typescript
import React from 'react';
import { Input } from '../../../shared/ui/Input';

interface DueDateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function DueDateField({ value, onChange }: DueDateFieldProps) {
  return (
    <Input
      type="date"
      label="Due Date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
}
```