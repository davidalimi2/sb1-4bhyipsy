```typescript
import React from 'react';
import { Input } from '../../../shared/ui/Input';

interface PartyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function PartyField({ value, onChange }: PartyFieldProps) {
  return (
    <Input
      label="Responding Party"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter the name of the responding party"
    />
  );
}
```