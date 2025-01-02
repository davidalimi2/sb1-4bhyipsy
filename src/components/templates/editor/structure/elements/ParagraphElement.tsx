import React from 'react';
import { TextArea } from '../../../../shared/ui/TextArea';
import type { StructureElement } from '../../../../../types/template';

interface ParagraphElementProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function ParagraphElement({ element, onUpdate }: ParagraphElementProps) {
  return (
    <TextArea
      value={element.content}
      onChange={(e) => onUpdate({ ...element, content: e.target.value })}
      placeholder="Enter paragraph text"
      rows={4}
    />
  );
}