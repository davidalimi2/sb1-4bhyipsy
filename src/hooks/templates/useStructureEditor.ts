import { useState, useCallback } from 'react';
import type { StructureElement } from '../../types/template';

interface UseStructureEditorOptions {
  initialStructure?: { elements: StructureElement[] };
  onChange: (structure: { elements: StructureElement[] }) => void;
}

export function useStructureEditor(
  initialStructure?: UseStructureEditorOptions['initialStructure'],
  onChange?: UseStructureEditorOptions['onChange']
) {
  const [structure, setStructure] = useState<StructureElement[]>(
    initialStructure?.elements || []
  );
  const [selectedElement, setSelectedElement] = useState<StructureElement | null>(null);

  const updateStructure = useCallback((updatedElement: StructureElement) => {
    setStructure(prev => {
      const newStructure = prev.map(element =>
        element.id === updatedElement.id ? updatedElement : element
      );
      onChange?.({ elements: newStructure });
      return newStructure;
    });
  }, [onChange]);

  const insertElement = useCallback((type: StructureElement['type']) => {
    const newElement: StructureElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      properties: {}
    };
    
    setStructure(prev => {
      const newStructure = [...prev, newElement];
      onChange?.({ elements: newStructure });
      return newStructure;
    });
  }, [onChange]);

  const removeElement = useCallback((elementId: string) => {
    setStructure(prev => {
      const newStructure = prev.filter(element => element.id !== elementId);
      onChange?.({ elements: newStructure });
      return newStructure;
    });
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  }, [onChange, selectedElement]);

  const moveElement = useCallback((sourceIndex: number, destinationIndex: number) => {
    setStructure(prev => {
      const newStructure = Array.from(prev);
      const [removed] = newStructure.splice(sourceIndex, 1);
      newStructure.splice(destinationIndex, 0, removed);
      onChange?.({ elements: newStructure });
      return newStructure;
    });
  }, [onChange]);

  return {
    structure,
    updateStructure,
    insertElement,
    removeElement,
    moveElement,
    selectedElement,
    setSelectedElement
  };
}