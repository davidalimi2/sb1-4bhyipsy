import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewMessageData } from '../types/message';

interface Draft extends NewMessageData {
  id: string;
  last_edited: string;
}

interface DraftStore {
  drafts: Draft[];
  getDraft: (id: string) => Draft | undefined;
  saveDraft: (data: NewMessageData) => string;
  updateDraft: (id: string, data: Partial<NewMessageData>) => void;
  deleteDraft: (id: string) => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      drafts: [],

      getDraft: (id) => {
        return get().drafts.find(draft => draft.id === id);
      },

      saveDraft: (data) => {
        const id = crypto.randomUUID();
        const draft: Draft = {
          ...data,
          id,
          last_edited: new Date().toISOString()
        };

        set(state => ({
          drafts: [draft, ...state.drafts]
        }));

        return id;
      },

      updateDraft: (id, data) => {
        set(state => ({
          drafts: state.drafts.map(draft =>
            draft.id === id
              ? {
                  ...draft,
                  ...data,
                  last_edited: new Date().toISOString()
                }
              : draft
          )
        }));
      },

      deleteDraft: (id) => {
        set(state => ({
          drafts: state.drafts.filter(draft => draft.id !== id)
        }));
      }
    }),
    {
      name: 'message-drafts'
    }
  )
);