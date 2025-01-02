import React from 'react';
import { Type, ListOrdered, Table, Quote, FileText } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { ElementProperties } from './ElementProperties';
import type { StructureElement } from '../../../../types/template';

interface StructureToolbarProps {
  onInsert: (type: StructureElement['type']) => void;
  selectedElement: StructureElement | null;
}

export function StructureToolbar({ onInsert, selectedElement }: StructureToolbarProps) {
  const elements = [
    { type: 'heading', icon: Type, label: 'Heading' },
    { type: 'paragraph', icon: FileText, label: 'Paragraph' },
    { type: 'list', icon: ListOrdered, label: 'List' },
    { type: 'table', icon: Table, label: 'Table' },
    { type: 'quote', icon: Quote, label: 'Quote' }
  ] as const;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-6">
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
        <ElementProperties
          element={selectedElement}
        />
      )}
    </div>
  );
}