import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../../../shared/ui/Input';
import { TextArea } from '../../../shared/ui/TextArea';
import { Button } from '../../../shared/ui/Button'; 
import { AIAssistant } from '../../ai/AIAssistant';

interface ClaimsStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function ClaimsStep({ formData, onChange }: ClaimsStepProps) {
  const [selectedClaimIndex, setSelectedClaimIndex] = useState<number | null>(null);

  const addClaim = () => {
    const claims = [...formData.claims, { title: '', description: '', elements: [] }];
    onChange({ ...formData, claims });
  };

  const updateClaim = (index: number, updates: any) => {
    const claims = [...formData.claims];
    claims[index] = { ...claims[index], ...updates };
    onChange({ ...formData, claims });
  };

  const removeClaim = (index: number) => {
    const claims = formData.claims.filter((_: any, i: number) => i !== index);
    onChange({ ...formData, claims });
  };

  const addElement = (claimIndex: number) => {
    const claims = [...formData.claims];
    claims[claimIndex].elements.push('');
    onChange({ ...formData, claims });
  };

  const updateElement = (claimIndex: number, elementIndex: number, value: string) => {
    const claims = [...formData.claims];
    claims[claimIndex].elements[elementIndex] = value;
    onChange({ ...formData, claims });
  };

  const removeElement = (claimIndex: number, elementIndex: number) => {
    const claims = [...formData.claims];
    claims[claimIndex].elements = claims[claimIndex].elements.filter((_: any, i: number) => i !== elementIndex);
    onChange({ ...formData, claims });
  };

  return (
    <div className="space-y-6">
      {formData.claims.map((claim: any, claimIndex: number) => (
        <div key={claimIndex} className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              <Input
                label="Claim Title"
                value={claim.title}
                onChange={(e) => updateClaim(claimIndex, { title: e.target.value })}
                placeholder="e.g., Breach of Contract"
              />
              
              <TextArea
                label="Description"
                value={claim.description}
                onChange={(e) => updateClaim(claimIndex, { description: e.target.value })}
                placeholder="Describe the legal basis for this claim..."
                rows={3}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Elements
                </label>
                {claim.elements.map((element: string, elementIndex: number) => (
                  <div key={elementIndex} className="flex items-center gap-2">
                    <Input
                      value={element}
                      onChange={(e) => updateElement(claimIndex, elementIndex, e.target.value)}
                      placeholder="Enter element"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Trash className="h-4 w-4" />}
                      onClick={() => removeElement(claimIndex, elementIndex)}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => addElement(claimIndex)}
                >
                  Add Element
                </Button>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Trash className="h-4 w-4" />}
              onClick={() => removeClaim(claimIndex)}
            />
          </div>
        </div>
      ))}

      <Button
        variant="secondary"
        icon={<Plus className="h-4 w-4" />}
        onClick={addClaim}
      >
        Add Claim
      </Button>
      {selectedClaimIndex !== null && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-4 overflow-y-auto">
          <AIAssistant
            content={formData.claims[selectedClaimIndex]?.description || ''}
            onSuggestion={(suggestion) => {
              const claims = [...formData.claims];
              claims[selectedClaimIndex].description = suggestion;
              onChange({ ...formData, claims });
            }}
            onClose={() => setSelectedClaimIndex(null)}
          />
        </div>
      )}
    </div>
  );
}