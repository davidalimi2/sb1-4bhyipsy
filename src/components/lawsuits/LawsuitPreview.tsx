import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import type { LawsuitTemplate } from '../../types/lawsuit';

interface LawsuitPreviewProps {
  template: LawsuitTemplate;
  answers: Record<string, any>;
}

export function LawsuitPreview({ template, answers }: LawsuitPreviewProps) {
  const generatePreview = () => {
    let content = JSON.parse(JSON.stringify(template.content));
    Object.entries(answers).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = JSON.stringify(content).replace(placeholder, value);
      content = JSON.parse(content);
    });
    return content;
  };

  const downloadPDF = async () => {
    // TODO: Implement PDF generation
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          icon={<Download className="h-4 w-4" />}
          onClick={downloadPDF}
        >
          Download PDF
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: generatePreview() }} />
        </div>
      </div>
    </div>
  );
}