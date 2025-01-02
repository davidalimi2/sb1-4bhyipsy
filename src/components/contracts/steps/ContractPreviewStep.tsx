import React from 'react';
import { RichTextEditor } from '../../shared/editor/RichTextEditor';
import { AIAssistant } from '../../lawsuits/ai/AIAssistant';

interface ContractPreviewStepProps {
  formData: any;
  onChange: (data: any) => void;
  template: any;
  analysis: any;
}

export function ContractPreviewStep({ formData, onChange, template, analysis }: ContractPreviewStepProps) {
  const handleContentChange = (content: string) => {
    onChange({
      ...formData,
      content
    });
  };

  // Generate initial content if empty
  React.useEffect(() => {
    if (!formData.content) {
      const content = generateContractContent(formData, template);
      handleContentChange(content);
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <RichTextEditor
          content={formData.content}
          onChange={handleContentChange}
          placeholder="Contract content will appear here..."
        />
      </div>
      
      <div>
        <AIAssistant
          content={formData.content}
          onSuggestion={(suggestion) => {
            handleContentChange(formData.content + '\n' + suggestion);
          }}
        />
      </div>
    </div>
  );
}

function generateContractContent(formData: any, template: any) {
  const { parties, terms } = formData;
  
  return `
AGREEMENT

This Agreement is made on ${terms.startDate} between:

${parties.party1Name}${parties.party1Title ? `, ${parties.party1Title}` : ''}${
    parties.party1Organization ? ` of ${parties.party1Organization}` : ''
} ("First Party")

and

${parties.party2Name}${parties.party2Title ? `, ${parties.party2Title}` : ''}${
    parties.party2Organization ? ` of ${parties.party2Organization}` : ''
} ("Second Party")

1. PURPOSE

${parties.purpose}

2. TERM

This Agreement shall commence on ${terms.startDate} and continue until ${terms.endDate}, unless terminated earlier in accordance with this Agreement.

3. TERMS AND CONDITIONS

${(terms.items || []).map((term: any, index: number) => `
${index + 3}. ${term.title}

${term.content}
`).join('\n')}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

FIRST PARTY:
${parties.party1Name}
${parties.party1Title}
${parties.party1Organization}

Signature: _______________________
Date: _______________________

SECOND PARTY:
${parties.party2Name}
${parties.party2Title}
${parties.party2Organization}

Signature: _______________________
Date: _______________________
  `.trim();
}