import React from 'react';
import { HeadingElement } from './HeadingElement';
import { ParagraphElement } from './ParagraphElement';
import { ListElement } from './ListElement';
import { TableElement } from './TableElement';
import { QuoteElement } from './QuoteElement';
import type { StructureElement } from '../../../../../types/template';

interface ElementContentProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function ElementContent({ element, onUpdate }: ElementContentProps) {
  const components = {
    heading: HeadingElement,
    paragraph: ParagraphElement,
    list: ListElement,
    table: TableElement,
    quote: QuoteElement
  };

  const Component = components[element.type];
  if (!Component) return null;

  return <Component element={element} onUpdate={onUpdate} />;
}