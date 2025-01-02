import { RecipientSelect } from './RecipientSelect';
import { SubjectField } from './SubjectField';
import { MessageEditor } from './MessageEditor';
import { AttachmentUpload } from './AttachmentUpload';
import { ComposeAttachments } from './ComposeAttachments';
import { Button } from '../../shared/ui/Button';
import { useMessageValidation } from '../../../hooks/messages/useMessageValidation';
import type { NewMessageData } from '../../../types/message';

interface ComposeFormProps {
  formData: NewMessageData;
  onChange: (data: NewMessageData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ComposeForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting
}: ComposeFormProps) {
  const { errors, validateField } = useMessageValidation();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <RecipientSelect
        value={formData.recipient_id}
        onChange={(value) => {
          onChange({ ...formData, recipient_id: value });
          validateField('recipient_id', value);
        }}
        error={errors.recipient_id}
      />

      <SubjectField
        value={formData.subject}
        onChange={(value) => {
          onChange({ ...formData, subject: value });
          validateField('subject', value);
        }}
        error={errors.subject}
      />

      <MessageEditor
        content={formData.content}
        onChange={(content) => {
          onChange({ ...formData, content });
          validateField('content', content);
        }}
        error={errors.content}
      />

      <AttachmentUpload
        onSelect={(files) => {
          onChange({
            ...formData,
            attachments: [...(formData.attachments || []), ...files]
          });
        }}
      />

      {formData.attachments?.length > 0 && (
        <ComposeAttachments
          files={formData.attachments}
          onRemove={(index) => {
            const newAttachments = [...formData.attachments];
            newAttachments.splice(index, 1);
            onChange({ ...formData, attachments: newAttachments });
          }}
        />
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}