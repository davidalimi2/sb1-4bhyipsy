import React from 'react';
import { FileText, Download, Share2 } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { PreviewContent } from './PreviewContent';
import { useTemplatePreview } from '../../../hooks/templates/useTemplatePreview';
import type { Template } from '../../../types/template';

interface TemplatePreviewProps {
  template: Template;
  answers?: Record<string, any>;
}

export function TemplatePreview({ template, answers = {} }: TemplatePreviewProps) {
  const { 
    previewContent,
    exportTemplate,
    shareTemplate,
    isLoading 
  } = useTemplatePreview(template);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon={<Share2 className="h-4 w-4" />}
            onClick={shareTemplate}
          >
            Share Template
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="h-4 w-4" />}
            onClick={exportTemplate}
          >
            Export Template
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg">
          <PreviewContent content={previewContent} />
        </div>
      )}
    </div>
  );
}