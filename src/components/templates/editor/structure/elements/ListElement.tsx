import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../../../../shared/ui/Input';
import { Switch } from '../../../../shared/ui/Switch';
import { Button } from '../../../../shared/ui/Button';
import type { StructureElement } from '../../../../../types/template';

interface ListElementProps {
  element: StructureElement;
  onUpdate: (element: StructureElement) => void;
}

export function ListElement({ element, onUpdate }: ListElementProps) {
  const items = element.content ? JSON.parse(element.content) : [];

  const addItem = () => {
    const newItems = [...items, ''];
    onUpdate({
      ...element,
      content: JSON.stringify(newItems)
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({
      ...element,
      content: JSON.stringify(newItems)
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onUpdate({
      ...element,
      content: JSON.stringify(newItems)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={element.properties.ordered || false}
          onChange={(checked) => onUpdate({
            ...element,
            properties: {
              ...element.properties,
              ordered: checked
            }
          })}
        />
        <span className="text-sm text-gray-700">Ordered List</span>
      </div>

      <div className="space-y-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 w-6">
              {element.properties.ordered ? `${index + 1}.` : '•'}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="List item"
            />
            <button
              onClick={() => removeItem(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={addItem}
        icon={<Plus className="h-4 w-4" />}
      >
        Add Item
      </Button>
    </div>
  );
}