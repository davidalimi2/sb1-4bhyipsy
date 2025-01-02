```typescript
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Message, MessageFilters, MessageSort } from '../types/message';

interface MessageState {
  messages: Message[];
  selectedMessage: Message | null;
  unreadCount: number;
  filters: MessageFilters;
  sort: MessageSort;
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: Message[]) => void;
  setSelectedMessage: (message: Message | null) => void;
  setFilters: (filters: Partial<MessageFilters>) => void;
  setSort: (sort: MessageSort) => void;
  fetchMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  archiveMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  selectedMessage: null,
  unreadCount: 0,
  filters: {
    status: 'unread',
    search: '',
  },
  sort: {
    field: 'created_at',
    direction: 'desc'
  },
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  setSort: (sort) => set({ sort }),

  fetchMessages: async () => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(full_name),
          recipient:recipient_id(full_name),
          attachments:message_attachments(*)
        `);

      // Apply filters
      const { filters } = get();
      if (filters.status === 'unread') {
        query = query.eq('read', false);
      }
      if (filters.search) {
        query = query.or(`subject.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const { sort } = get();
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      const { data, error } = await query;
      if (error) throw error;

      set({ 
        messages: data || [],
        unreadCount: data?.filter(m => !m.read).length || 0
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;

      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },

  archiveMessage: async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ archived: true })
        .eq('id', messageId);

      if (error) throw error;

      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }));
    } catch (error) {
      console.error('Failed to archive message:', error);
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }
}));
```