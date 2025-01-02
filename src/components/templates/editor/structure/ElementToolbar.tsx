```typescript
import React from 'react';
import { Type, ListOrdered, Table, Quote, FileText, ArrowUp, ArrowDown, Trash } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import type { StructureElement } from '../../../../types/template';

interface ElementToolbarProps {
  selectedElement: StructureElement | null;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onInsert: (type: StructureElement['type']) => void;
}

export function ElementToolbar({
  selectedElement,
  onMoveUp,
  onMoveDown,
  onDelete,
  onInsert
}: ElementToolbarProps) {
  const elements = [
    { type: 'heading', icon: Type, label: 'Heading' },
    { type: 'paragraph', icon: FileText, label: 'Paragraph' },
    { type: 'list', icon: ListOrdered, label: 'List' },
    { type: 'table', icon: Table, label: 'Table' },
    { type: 'quote', icon: Quote, label: 'Quote' }
  ] as const;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Insert Element</h3>
        <div className="grid grid-cols-2 gap-2">
          {elements.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant="secondary"
              size="sm"
              onClick={() => onInsert(type)}
              className="flex flex-col items-center py-3"
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedElement && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Element Actions</h3>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onMoveUp}
              icon={<ArrowUp className="h-4 w-4" />}
            >
              Move Up
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onMoveDown}
              icon={<ArrowDown className="h-4 w-4" />}
            >
              Move Down
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onDelete}
              icon={<Trash className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```