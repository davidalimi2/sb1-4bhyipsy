import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { StructureElement } from './elements/StructureElement';
import type { StructureElement as StructureElementType } from '../../../../types/template';

interface StructurePreviewProps {
  structure: StructureElementType[];
  selectedElement: StructureElementType | null;
  onSelect: (element: StructureElementType | null) => void;
  onUpdate: (element: StructureElementType) => void;
  onMove: (sourceIndex: number, destinationIndex: number) => void;
  onRemove: (elementId: string) => void;
}

export function StructurePreview({
  structure,
  selectedElement,
  onSelect,
  onUpdate,
  onMove,
  onRemove
}: StructurePreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = structure.findIndex(item => item.id === active.id);
    const newIndex = structure.findIndex(item => item.id === over.id);
    
    onMove(oldIndex, newIndex);
  };

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={structure.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {structure.map((element) => (
              <StructureElement
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                onClick={() => onSelect(element)}
                onUpdate={onUpdate}
                onRemove={() => onRemove(element.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}