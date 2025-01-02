import React from 'react';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { TextArea } from '../../../shared/ui/TextArea';
import type { StructureElement } from '../../../../types/template';

interface ElementPropertiesProps {
  element: StructureElement;
}

export function ElementProperties({ element }: ElementPropertiesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Element Properties</h3>

      {element.type === 'heading' && (
        <Select
          label="Heading Level"
          value={element.properties.level || '1'}
          onChange={(e) => {
            // Handle level change
          }}
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
          onChange={(e) => {
            // Handle style change
          }}
        >
          <option value="normal">Normal</option>
          <option value="emphasis">Emphasis</option>
          <option value="small">Small</option>
        </Select>
      )}

      {element.type === 'list' && (
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={element.properties.ordered}
              onChange={(e) => {
                // Handle ordered change
              }}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Ordered List</span>
          </label>
        </div>
      )}

      {element.type === 'quote' && (
        <Input
          label="Citation"
          value={element.properties.citation || ''}
          onChange={(e) => {
            // Handle citation change
          }}
          placeholder="Enter citation"
        />
      )}

      <TextArea
        label="Custom CSS Classes"
        value={element.properties.className || ''}
        onChange={(e) => {
          // Handle className change
        }}
        placeholder="Enter custom CSS classes"
        rows={2}
      />
    </div>
  );
}