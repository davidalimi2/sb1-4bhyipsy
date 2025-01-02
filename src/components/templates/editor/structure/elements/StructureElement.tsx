import React from 'react';
import { Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ElementContent } from './ElementContent';
import type { StructureElement as StructureElementType } from '../../../../../types/template';

interface StructureElementProps {
  element: StructureElementType;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: StructureElementType) => void;
  onRemove: () => void;
}

export function StructureElement({
  element,
  isSelected,
  onClick,
  onUpdate,
  onRemove
}: StructureElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative p-4 border rounded-lg cursor-pointer
        ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <ElementContent
        element={element}
        onUpdate={onUpdate}
      />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
}