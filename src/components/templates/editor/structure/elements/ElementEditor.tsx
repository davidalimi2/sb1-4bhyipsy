```typescript
import React from 'react';
import { Input } from '../../../../shared/ui/Input';
import { Select } from '../../../../shared/ui/Select';
import { TextArea } from '../../../../shared/ui/TextArea';
import type { StructureElement } from '../../../../../types/template';

interface ElementEditorProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function ElementEditor({ element, onUpdate }: ElementEditorProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Common Properties */}
      <TextArea
        label="Content"
        value={element.content}
        onChange={(e) => onUpdate({ ...element, content: e.target.value })}
        rows={3}
      />

      <Input
        label="CSS Classes"
        value={element.properties.className || ''}
        onChange={(e) => updateProperty('className', e.target.value)}
        placeholder="Enter custom CSS classes"
      />

      {/* Element-specific Properties */}
      {element.type === 'heading' && (
        <Select
          label="Heading Level"
          value={element.properties.level || '1'}
          onChange={(e) => updateProperty('level', parseInt(e.target.value))}
        >
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </Select>
      )}

      {element.type === 'paragraph' && (
        <Select
          label="Style"
          value={element.properties.style || 'normal'}
          onChange={(e) => updateProperty('style', e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="emphasis">Emphasis</option>
          <option value="small">Small</option>
        </Select>
      )}

      {element.type === 'quote' && (
        <Input
          label="Citation"
          value={element.properties.citation || ''}
          onChange={(e) => updateProperty('citation', e.target.value)}
          placeholder="Enter citation"
        />
      )}
    </div>
  );
}
```