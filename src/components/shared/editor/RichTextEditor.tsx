import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { defaultExtensions } from './extensions';
import { EditorToolbar } from './EditorToolbar';
import './styles/editor.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  features?: string[];
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write something...',
  minHeight = '200px',
  readOnly = false,
  showToolbar = true,
  features = ['all']
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: defaultExtensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none',
        style: `min-height: ${minHeight}`,
        'data-placeholder': placeholder
      }
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {showToolbar && !readOnly && <EditorToolbar editor={editor} features={features} />}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}