import React, { useState } from 'react';
import { AlertCircle, Download, FileSignature } from 'lucide-react';
import { RichTextEditor } from '../../../shared/editor/RichTextEditor';
import { AIAssistant } from '../../ai/AIAssistant';
import { Button } from '../../../shared/ui/Button';
import { convertToPdf } from '../../../../utils/pdfUtils';
import { SignatureModal } from '../../../shared/ui/SignatureModal';

interface PreviewStepProps {
  formData: {
    content: string;
    title?: string;
  };
  onChange: (data: any) => void;
  analysis?: {
    suggestions?: string[];
    legalCitations?: Array<{
      citation: string;
      relevance: string;
    }>;
  };
}

export function PreviewStep({ formData, onChange, analysis }: PreviewStepProps) {
  const [showSignature, setShowSignature] = useState(false);

  const handleExportPdf = async () => {
    const pdfBlob = await convertToPdf(formData.content);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title || 'document'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {analysis?.suggestions?.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                AI Suggestions
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RichTextEditor
            content={formData.content}
            onChange={(content) => onChange({ ...formData, content })}
            features={[
              'heading',
              'bold',
              'italic',
              'bulletList',
              'orderedList',
              'blockquote',
              'table',
              'link'
            ]}
          />
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button
              variant="secondary"
              icon={<Download className="h-4 w-4" />}
              onClick={handleExportPdf}
            >
              Export PDF
            </Button>
            <Button
              variant="secondary" 
              icon={<FileSignature className="h-4 w-4" />}
              onClick={() => setShowSignature(true)}
            >
              eSign
            </Button>
          </div>
        </div>

        <div>
          <AIAssistant
            content={formData.content}
            onSuggestion={(suggestion) => {
              onChange({
                ...formData,
                content: formData.content + '\n' + suggestion
              });
            }}
          />
        </div>
      </div>

      {analysis?.legalCitations?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Legal Citations
          </h4>
          <ul className="space-y-2">
            {analysis.legalCitations.map((citation, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{citation.citation}</span>
                <span className="text-gray-500 ml-2">- {citation.relevance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSignature && (
        <SignatureModal
          onSign={(signature) => {
            onChange({
              ...formData,
              content: formData.content + '\n\n' + signature
            });
            setShowSignature(false);
          }}
          onClose={() => setShowSignature(false)}
        />
      )}
    </div>
  );
}