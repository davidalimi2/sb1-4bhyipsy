import React from 'react';
import { renderElement } from '../../../utils/templateRenderer';
import type { StructureElement } from '../../../types/template';

interface PreviewContentProps {
  content: StructureElement[];
}

export function PreviewContent({ content }: PreviewContentProps) {
  return (
    <div className="p-8 prose max-w-none">
      {content.map((element) => (
        <div key={element.id}>
          {renderElement(element)}
        </div>
      ))}
    </div>
  );
}