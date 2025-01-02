import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrafts } from '../../../hooks/messages/useDrafts';
import type { NewMessageData } from '../../../types/message';

interface DraftManagerProps {
  formData: NewMessageData;
  onChange: (data: NewMessageData) => void;
}

export function DraftManager({ formData, onChange }: DraftManagerProps) {
  const navigate = useNavigate();
  const { saveDraft, updateDraft } = useDrafts();

  // Auto-save draft every 30 seconds if there are changes
  useEffect(() => {
    const draftId = localStorage.getItem('currentDraftId');
    if (!draftId) return;

    const interval = setInterval(() => {
      updateDraft(draftId, formData);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, updateDraft]);

  // Save draft when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.subject || formData.content) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  return null;
}