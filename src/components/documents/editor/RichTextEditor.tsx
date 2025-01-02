```typescript
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import { legalStyles } from '../../../utils/documentStyles';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function RichTextEditor({ content, onChange, className = '' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableCell
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none focus:outline-none ${className}`,
      }
    }
  });

  if (!editor) return null;

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <style>{legalStyles}</style>
      <EditorContent editor={editor} />
    </div>
  );
}
```