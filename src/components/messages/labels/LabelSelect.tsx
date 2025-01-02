import { useState } from 'react';
import { Tag } from 'lucide-react';
import { useMessageLabels } from '../../../hooks/messages/useMessageLabels';
import { LabelBadge } from './LabelBadge';
import { Button } from '../../shared/ui/Button';
import type { MessageLabel } from '../../../types/message';

interface LabelSelectProps {
  selectedLabels: MessageLabel[];
  onChange: (labels: MessageLabel[]) => void;
}

export function LabelSelect({ selectedLabels, onChange }: LabelSelectProps) {
  const { labels } = useMessageLabels();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (label: MessageLabel) => {
    if (selectedLabels.find(l => l.id === label.id)) {
      onChange(selectedLabels.filter(l => l.id !== label.id));
    } else {
      onChange([...selectedLabels, label]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 min-h-[2.5rem] p-2 border rounded-md">
        {selectedLabels.map(label => (
          <LabelBadge
            key={label.id}
            label={label}
            onRemove={() => handleSelect(label)}
          />
        ))}
        <Button
          variant="secondary"
          size="sm"
          icon={<Tag className="h-4 w-4" />}
          onClick={() => setIsOpen(!isOpen)}
        >
          Add Label
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
          <div className="p-2 space-y-1">
            {labels.map(label => (
              <button
                key={label.id}
                onClick={() => handleSelect(label)}
                className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50"
              >
                <Tag
                  className="h-4 w-4 mr-2"
                  style={{ color: label.color }}
                />
                <span>{label.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}