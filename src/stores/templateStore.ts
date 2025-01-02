```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { MessageTemplate } from '../types/message';

interface TemplateStore {
  templates: MessageTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: Omit<MessageTemplate, 'id' | 'created_at'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<MessageTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],
      isLoading: false,
      error: null,

      fetchTemplates: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('message_templates')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ templates: data || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch templates' });
        } finally {
          set({ isLoading: false });
        }
      },

      createTemplate: async (template) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('message_templates')
            .insert(template)
            .select()
            .single();

          if (error) throw error;
          set(state => ({
            templates: [data, ...state.templates]
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create template' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateTemplate: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase
            .from('message_templates')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          set(state => ({
            templates: state.templates.map(t =>
              t.id === id ? { ...t, ...data } : t
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update template' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTemplate: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          const { error } = await supabase
            .from('message_templates')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            templates: state.templates.filter(t => t.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete template' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'message-templates'
    }
  )
);
```