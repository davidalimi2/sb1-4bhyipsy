import React from 'react';
import { Input } from '../../shared/ui/Input';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import { Plus, Trash, Wand2 } from 'lucide-react';
import { useAIAssistant } from '../../../hooks/ai/useAIAssistant';

interface ContractTermsStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function ContractTermsStep({ formData, onChange }: ContractTermsStepProps) {
  const { generateSuggestions, isAnalyzing } = useAIAssistant();
  const updateTerms = (updates: any) => {
    onChange({
      ...formData,
      terms: {
        ...formData.terms,
        ...updates
      }
    });
  };

  const addTerm = () => {
    const terms = formData.terms.items || [];
    updateTerms({
      items: [...terms, { title: '', content: '' }]
    });
  };

  const updateTermItem = (index: number, updates: any) => {
    const terms = [...(formData.terms.items || [])];
    terms[index] = { ...terms[index], ...updates };
    updateTerms({ items: terms });
  };

  const removeTerm = (index: number) => {
    const terms = formData.terms.items || [];
    updateTerms({
      items: terms.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input
          type="date"
          label="Start Date"
          value={formData.terms.startDate || ''}
          onChange={(e) => updateTerms({ startDate: e.target.value })}
          required
        />
        <Input
          type="date"
          label="End Date"
          value={formData.terms.endDate || ''}
          onChange={(e) => updateTerms({ endDate: e.target.value })}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={addTerm}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Term
          </Button>
        </div>

        {(formData.terms.items || []).map((term: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                <Input
                  label="Term Title"
                  value={term.title}
                  onChange={(e) => updateTermItem(index, { title: e.target.value })}
                  placeholder="e.g., Payment Terms"
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
                            field: 'termTitle',
                            context: { index, terms: formData.terms }
                          }
                        });
                        if (suggestions?.[0]) {
                          updateTermItem(index, { title: suggestions[0] });
                        }
                      }}
                      icon={<Wand2 className="h-4 w-4" />}
                    >
                      Suggest
                    </Button>
                  }
                />
                <TextArea
                  label="Term Content"
                  value={term.content}
                  onChange={(e) => updateTermItem(index, { content: e.target.value })}
                  placeholder="Enter the details of this term..."
                  rows={3}
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
                            field: 'termContent',
                            context: { 
                              index,
                              title: term.title,
                              terms: formData.terms
                            }
                          }
                        });
                        if (suggestions?.[0]) {
                          updateTermItem(index, { content: suggestions[0] });
                        }
                      }}
                      icon={<Wand2 className="h-4 w-4" />}
                    >
                      Suggest
                    </Button>
                  }
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => removeTerm(index)}
                icon={<Trash className="h-4 w-4" />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}