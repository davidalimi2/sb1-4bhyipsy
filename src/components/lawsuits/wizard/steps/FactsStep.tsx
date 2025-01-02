import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { TextArea } from '../../../shared/ui/TextArea';
import { Button } from '../../../shared/ui/Button';
import { AIAssistant } from '../../ai/AIAssistant';

interface FactsStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function FactsStep({ formData, onChange }: FactsStepProps) {
  const [selectedFactIndex, setSelectedFactIndex] = useState<number | null>(null);

  const addFact = () => {
    const facts = [...formData.facts, ''];
    onChange({ ...formData, facts });
  };

  const updateFact = (index: number, value: string) => {
    const facts = [...formData.facts];
    facts[index] = value;
    onChange({ ...formData, facts });
  };

  const removeFact = (index: number) => {
    const facts = formData.facts.filter((_: any, i: number) => i !== index);
    onChange({ ...formData, facts });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {formData.facts.map((fact: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-sm">
                {index + 1}
              </span>
            </div>
            <div className="flex-1">
              <TextArea
                value={fact}
                onChange={(e) => updateFact(index, e.target.value)}
                placeholder="Enter factual allegation..."
                rows={2}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Trash className="h-4 w-4" />}
              onClick={() => removeFact(index)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        icon={<Plus className="h-4 w-4" />}
        onClick={addFact}
      >
        Add Fact
      </Button>
      {selectedFactIndex !== null && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-4 overflow-y-auto">
          <AIAssistant
            content={formData.facts[selectedFactIndex] || ''}
            onSuggestion={(suggestion) => {
              const facts = [...formData.facts];
              facts[selectedFactIndex] = suggestion;
              onChange({ ...formData, facts });
            }}
            onClose={() => setSelectedFactIndex(null)}
          />
        </div>
      )}
    </div>
  );
}