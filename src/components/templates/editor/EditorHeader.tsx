import React from 'react';

interface EditorHeaderProps {
  title: string;
}

export function EditorHeader({ title }: EditorHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Fill out the template details below. You can preview and edit the template structure in the following steps.
      </p>
    </div>
  );
}