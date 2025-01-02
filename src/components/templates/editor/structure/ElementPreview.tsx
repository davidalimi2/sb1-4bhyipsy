```typescript
import React from 'react';
import { renderElement } from '../../../../utils/templateRenderer';
import type { StructureElement } from '../../../../types/template';

interface ElementPreviewProps {
  element: StructureElement;
  isSelected: boolean;
  onClick: () => void;
}

export function ElementPreview({ element, isSelected, onClick }: ElementPreviewProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="prose max-w-none">
        {renderElement(element)}
      </div>
      
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}
```