import React from 'react';
import { RichTextEditor } from '../../shared/editor/RichTextEditor';
import { AIAssistant } from '../../lawsuits/ai/AIAssistant';

interface LetterPreviewStepProps {
  formData: any;
  onChange: (data: any) => void;
  analysis: any;
}

export function LetterPreviewStep({ formData, onChange, analysis }: LetterPreviewStepProps) {
  const handleContentChange = (content: string) => {
    onChange({
      ...formData,
      content
    });
  };

  // Generate initial content if empty
  React.useEffect(() => {
    if (!formData.content) {
      const content = generateLetterContent(formData);
      handleContentChange(content);
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <RichTextEditor
          content={formData.content}
          onChange={handleContentChange}
          placeholder="Letter content will appear here..."
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

function generateLetterContent(formData: any) {
  const today = new Date().toLocaleDateString();
  const { recipient, signature } = formData;
  
  return `
${today}

${recipient.name}${recipient.title ? `\n${recipient.title}` : ''}
${recipient.organization ? `\n${recipient.organization}` : ''}
${recipient.address}

Dear ${recipient.title ? `${recipient.title} ` : ''}${recipient.name},

${formData.content}

Sincerely,

${signature.name}
${signature.title}
${signature.organization}
  `.trim();
}