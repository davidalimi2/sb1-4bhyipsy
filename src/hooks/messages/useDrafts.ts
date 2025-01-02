import { useCallback } from 'react';
import { useDraftStore } from '../../stores/draftStore';
import { useNotifications } from '../useNotifications';
import type { NewMessageData } from '../../types/message';

export function useDrafts() {
  const { drafts, saveDraft, updateDraft, deleteDraft } = useDraftStore();
  const { addNotification } = useNotifications();

  const handleSaveDraft = useCallback((data: NewMessageData) => {
    const draftId = saveDraft(data);
    addNotification({
      type: 'success',
      title: 'Draft saved',
      message: 'Message saved as draft'
    });
    return draftId;
  }, [saveDraft, addNotification]);

  const handleUpdateDraft = useCallback((id: string, data: Partial<NewMessageData>) => {
    updateDraft(id, data);
    addNotification({
      type: 'success',
      title: 'Draft updated',
      message: 'Draft has been updated'
    });
  }, [updateDraft, addNotification]);

  const handleDeleteDraft = useCallback((id: string) => {
    deleteDraft(id);
    addNotification({
      type: 'success',
      title: 'Draft deleted',
      message: 'Draft has been deleted'
    });
  }, [deleteDraft, addNotification]);

  return {
    drafts,
    saveDraft: handleSaveDraft,
    updateDraft: handleUpdateDraft,
    deleteDraft: handleDeleteDraft
  };
}