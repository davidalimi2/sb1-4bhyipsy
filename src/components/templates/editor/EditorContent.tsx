import React from 'react';
import { TemplateBasicInfo } from './TemplateBasicInfo';
import { QuestionBuilder } from './QuestionBuilder';
import { StructureEditor } from './structure/StructureEditor';
import type { Template } from '../../../types/template';

interface EditorContentProps {
  step: number;
  template: Partial<Template>;
  onChange: (updates: Partial<Template>) => void;
}

export function EditorContent({ step, template, onChange }: EditorContentProps) {
  const steps = [
    {
      Component: TemplateBasicInfo,
      props: { template, onChange }
    },
    {
      Component: QuestionBuilder,
      props: { template, onChange }
    },
    {
      Component: StructureEditor,
      props: { template, onChange }
    }
  ];

  if (step < 0 || step >= steps.length) {
    return null;
  }

  const { Component, props } = steps[step];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Component {...props} />
    </div>
  );
}