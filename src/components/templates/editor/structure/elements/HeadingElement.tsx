import React from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import type { StructureElement } from '../../../../../types/template';

interface HeadingElementProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function HeadingElement({ element, onUpdate }: HeadingElementProps) {
  return (
    <div className="space-y-4">
      <Input
        value={element.content}
        onChange={(e) => onUpdate({ ...element, content: e.target.value })}
        placeholder="Enter heading text"
      />
      
      <Select
        value={element.properties.level || '1'}
        onChange={(e) => onUpdate({
          ...element,
          properties: {
            ...element.properties,
            level: parseInt(e.target.value)
          }
        })}
      >
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </Select>
    </div>
  );
}