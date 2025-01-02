import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useTemplateStore } from '../../../stores/templateStore';

interface TemplateSelectProps {
  onSelect: (content: string) => void;
}

export function TemplateSelect({ onSelect }: TemplateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { templates } = useTemplateStore();

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        icon={<FileText className="h-4 w-4" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Use Template
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-lg">
          <div className="p-2 space-y-1">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template.content);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}