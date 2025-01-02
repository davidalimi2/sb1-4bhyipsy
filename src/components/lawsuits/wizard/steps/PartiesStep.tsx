import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

interface PartiesStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function PartiesStep({ formData, onChange }: PartiesStepProps) {
  const addParty = (type: 'plaintiffs' | 'defendants') => {
    const parties = [...formData.parties[type], ''];
    onChange({
      ...formData,
      parties: {
        ...formData.parties,
        [type]: parties
      }
    });
  };

  const updateParty = (type: 'plaintiffs' | 'defendants', index: number, value: string) => {
    const parties = [...formData.parties[type]];
    parties[index] = value;
    onChange({
      ...formData,
      parties: {
        ...formData.parties,
        [type]: parties
      }
    });
  };

  const removeParty = (type: 'plaintiffs' | 'defendants', index: number) => {
    const parties = formData.parties[type].filter((_: any, i: number) => i !== index);
    onChange({
      ...formData,
      parties: {
        ...formData.parties,
        [type]: parties
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Plaintiffs */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plaintiffs</h3>
        <div className="space-y-3">
          {formData.parties.plaintiffs.map((plaintiff: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={plaintiff}
                onChange={(e) => updateParty('plaintiffs', index, e.target.value)}
                placeholder="Enter plaintiff name"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<Trash className="h-4 w-4" />}
                onClick={() => removeParty('plaintiffs', index)}
              />
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => addParty('plaintiffs')}
          >
            Add Plaintiff
          </Button>
        </div>
      </div>

      {/* Defendants */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Defendants</h3>
        <div className="space-y-3">
          {formData.parties.defendants.map((defendant: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={defendant}
                onChange={(e) => updateParty('defendants', index, e.target.value)}
                placeholder="Enter defendant name"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<Trash className="h-4 w-4" />}
                onClick={() => removeParty('defendants', index)}
              />
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => addParty('defendants')}
          >
            Add Defendant
          </Button>
        </div>
      </div>
    </div>
  );
}