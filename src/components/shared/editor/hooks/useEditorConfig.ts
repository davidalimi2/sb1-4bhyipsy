import { EditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Extension } from '@tiptap/core';

interface UseEditorConfigOptions {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
}

export function useEditorConfig({
  content,
  onChange,
  placeholder = 'Write something...',
  minHeight = '200px',
  readOnly = false
}: UseEditorConfigOptions): EditorOptions {
  return {
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-900'
        }
      })
    ],
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
  };
}