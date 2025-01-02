```typescript
import React from 'react';
import { Select } from '../../../shared/ui/Select';
import { getDiscoveryTypeLabel } from '../../../../utils/discoveryUtils';
import type { DiscoveryType } from '../../../../types/discovery';

interface RequestTypeFieldProps {
  value: DiscoveryType;
  onChange: (value: DiscoveryType) => void;
}

export function RequestTypeField({ value, onChange }: RequestTypeFieldProps) {
  return (
    <Select
      label="Request Type"
      value={value}
      onChange={(e) => onChange(e.target.value as DiscoveryType)}
      required
    >
      {(['document_request', 'interrogatory', 'admission_request', 'deposition_notice'] as const).map(type => (
        <option key={type} value={type}>
          {getDiscoveryTypeLabel(type)}
        </option>
      ))}
    </Select>
  );
}
```