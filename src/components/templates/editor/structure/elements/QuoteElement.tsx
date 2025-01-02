import React from 'react';
import { TextArea } from '../../../../shared/ui/TextArea';
import { Input } from '../../../../shared/ui/Input';
import type { StructureElement } from '../../../../../types/template';

interface QuoteElementProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function QuoteElement({ element, onUpdate }: QuoteElementProps) {
  return (
    <div className="space-y-4">
      <TextArea
        value={element.content}
        onChange={(e) => onUpdate({ ...element, content: e.target.value })}
        placeholder="Enter quote text"
        rows={3}
      />
      
      <Input
        value={element.properties.citation || ''}
        onChange={(e) => onUpdate({
          ...element,
          properties: {
            ...element.properties,
            citation: e.target.value
          }
        })}
        placeholder="Citation (optional)"
      />
    </div>
  );
}