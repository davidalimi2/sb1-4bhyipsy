import React from 'react';
import { StructurePreview } from './StructurePreview';
import { StructureToolbar } from './StructureToolbar';
import { useStructureEditor } from '../../../../hooks/templates/useStructureEditor';
import type { Template } from '../../../../types/template';

interface StructureEditorProps {
  template: Partial<Template>;
  onChange: (updates: Partial<Template>) => void;
}

export function StructureEditor({ template, onChange }: StructureEditorProps) {
  const {
    structure,
    updateStructure,
    insertElement,
    removeElement,
    moveElement,
    selectedElement,
    setSelectedElement
  } = useStructureEditor(template.structure, (newStructure) => {
    onChange({ structure: newStructure });
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-64 flex-shrink-0">
          <StructureToolbar
            onInsert={insertElement}
            selectedElement={selectedElement}
          />
        </div>
        
        <div className="flex-1 min-h-[600px] border rounded-lg">
          <StructurePreview
            structure={structure}
            selectedElement={selectedElement}
            onSelect={setSelectedElement}
            onUpdate={updateStructure}
            onMove={moveElement}
            onRemove={removeElement}
          />
        </div>
      </div>
    </div>
  );
}