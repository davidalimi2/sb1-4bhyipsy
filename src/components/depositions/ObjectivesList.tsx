import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';

interface ObjectivesListProps {
  objectives: string[];
  onChange: (objectives: string[]) => void;
}

export function ObjectivesList({ objectives, onChange }: ObjectivesListProps) {
  const addObjective = () => {
    onChange([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    onChange(objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    onChange(newObjectives);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Objectives</h3>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={addObjective}
        >
          Add Objective
        </Button>
      </div>

      <div className="space-y-2">
        {objectives.map((objective, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={objective}
              onChange={(e) => updateObjective(index, e.target.value)}
              placeholder="Enter objective"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<Trash className="h-4 w-4" />}
              onClick={() => removeObjective(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}