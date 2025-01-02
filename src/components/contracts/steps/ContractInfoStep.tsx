import React from 'react';
import { Input } from '../../shared/ui/Input';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import { Wand2 } from 'lucide-react';
import { useAIAssistant } from '../../../hooks/ai/useAIAssistant';

interface ContractInfoStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function ContractInfoStep({ formData, onChange }: ContractInfoStepProps) {
  const { generateSuggestions, isAnalyzing } = useAIAssistant();
  const updateParties = (updates: any) => {
    onChange({
      ...formData,
      parties: {
        ...formData.parties,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      <Input
        label="Contract Title"
        value={formData.parties.title || ''}
        onChange={(e) => updateParties({ title: e.target.value })} 
        required
        suffix={
          <Button
            variant="ghost"
            size="sm"
            disabled={isAnalyzing}
            onClick={async () => {
              const suggestions = await generateSuggestions({
                type: 'content',
                data: {
                  field: 'title',
                  context: formData.parties
                }
              });
              if (suggestions?.[0]) {
                updateParties({ title: suggestions[0] });
              }
            }}
            icon={<Wand2 className="h-4 w-4" />}
          >
            Suggest
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">First Party</h3>
          <Input
            label="Full Name"
            value={formData.parties.party1Name || ''}
            onChange={(e) => updateParties({ party1Name: e.target.value })}
            required
          />
          <Input
            label="Title/Position"
            value={formData.parties.party1Title || ''}
            onChange={(e) => updateParties({ party1Title: e.target.value })}
          />
          <Input
            label="Organization"
            value={formData.parties.party1Organization || ''}
            onChange={(e) => updateParties({ party1Organization: e.target.value })}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Second Party</h3>
          <Input
            label="Full Name"
            value={formData.parties.party2Name || ''}
            onChange={(e) => updateParties({ party2Name: e.target.value })}
            required
          />
          <Input
            label="Title/Position"
            value={formData.parties.party2Title || ''}
            onChange={(e) => updateParties({ party2Title: e.target.value })}
          />
          <Input
            label="Organization"
            value={formData.parties.party2Organization || ''}
            onChange={(e) => updateParties({ party2Organization: e.target.value })}
          />
        </div>
      </div>

      <TextArea
        label="Contract Purpose"
        value={formData.parties.purpose || ''}
        onChange={(e) => updateParties({ purpose: e.target.value })} 
        placeholder="Describe the purpose and scope of this contract..."
        rows={4}
        required
        suffix={
          <Button
            variant="ghost"
            size="sm"
            disabled={isAnalyzing}
            onClick={async () => {
              const suggestions = await generateSuggestions({
                type: 'content',
                data: {
                  field: 'purpose',
                  context: formData.parties
                }
              });
              if (suggestions?.[0]) {
                updateParties({ purpose: suggestions[0] });
              }
            }}
            icon={<Wand2 className="h-4 w-4" />}
          >
            Suggest
          </Button>
        }
      />
    </div>
  );
}