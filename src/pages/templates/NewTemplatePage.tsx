import React from 'react';
import { EditorHeader } from '../../components/templates/editor/EditorHeader';
import { TemplateEditor } from '../../components/templates/editor/TemplateEditor';

export function NewTemplatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EditorHeader title="Create New Template" />
      <TemplateEditor />
    </div>
  );
}