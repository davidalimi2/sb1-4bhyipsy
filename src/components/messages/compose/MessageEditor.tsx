import { RichTextEditor } from '../../shared/editor/RichTextEditor';

interface MessageEditorProps {
  content: string;
  onChange: (content: string) => void;
  error?: string;
}

export function MessageEditor({ content, onChange, error }: MessageEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Message
      </label>
      <RichTextEditor
        content={content}
        onChange={onChange}
        placeholder="Write your message..."
        minHeight="200px"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}