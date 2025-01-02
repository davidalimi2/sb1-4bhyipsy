import React from 'react';
import { Input } from '../../shared/ui/Input';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import { Wand2 } from 'lucide-react';
import { useAIAssistant } from '../../../hooks/ai/useAIAssistant';

interface LetterDetailsStepProps {
  formData: any;
  onChange: (data: any) => void;
}

export function LetterDetailsStep({ formData, onChange }: LetterDetailsStepProps) {
  const { generateSuggestions, isAnalyzing } = useAIAssistant();

  const updateRecipient = (updates: any) => {
    onChange({
      ...formData,
      recipient: {
        ...formData.recipient,
        ...updates
      }
    });
  };

  const updateSignature = (updates: any) => {
    onChange({
      ...formData,
      signature: {
        ...formData.signature,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Recipient Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recipient Information</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.recipient.name}
            onChange={(e) => updateRecipient({ name: e.target.value })}
            required
          />
          <Input
            label="Title/Position"
            value={formData.recipient.title}
            onChange={(e) => updateRecipient({ title: e.target.value })}
          />
          <Input
            label="Organization"
            value={formData.recipient.organization}
            onChange={(e) => updateRecipient({ organization: e.target.value })}
          />
          <TextArea
            label="Address"
            value={formData.recipient.address}
            onChange={(e) => updateRecipient({ address: e.target.value })}
            rows={3}
            required
          />
        </div>
      </div>

      {/* Letter Content */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Letter Content</h3>
        <TextArea
          value={formData.content}
          onChange={(e) => onChange({ ...formData, content: e.target.value })}
          placeholder="Enter the main content of your letter..."
          rows={8}
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
                    letterType: formData.type,
                    recipient: formData.recipient
                  }
                });
                if (suggestions?.[0]) {
                  onChange({ ...formData, content: suggestions[0] });
                }
              }}
              icon={<Wand2 className="h-4 w-4" />}
            >
              Generate Content
            </Button>
          }
        />
      </div>

      {/* Signature Block */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Signature</h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.signature.name}
            onChange={(e) => updateSignature({ name: e.target.value })}
            required
          />
          <Input
            label="Title/Position"
            value={formData.signature.title}
            onChange={(e) => updateSignature({ title: e.target.value })}
          />
          <Input
            label="Organization"
            value={formData.signature.organization}
            onChange={(e) => updateSignature({ organization: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}