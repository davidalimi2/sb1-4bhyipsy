```typescript
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessageStore } from '../stores/messageStore';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { selectedMessage, markAsRead, archiveMessage, deleteMessage } = useMessageStore();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'c',
      description: 'Compose new message',
      ctrl: true,
      action: () => navigate('/messages/new')
    },
    {
      key: '/',
      description: 'Focus search',
      action: () => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
    },
    {
      key: 'Escape',
      description: 'Clear selection/focus',
      action: () => document.activeElement?.blur()
    },
    {
      key: 'j',
      description: 'Next message',
      action: () => {
        // Implement message navigation
      }
    },
    {
      key: 'k',
      description: 'Previous message',
      action: () => {
        // Implement message navigation
      }
    },
    {
      key: 'r',
      description: 'Reply to message',
      action: () => {
        if (selectedMessage) {
          navigate(`/messages/${selectedMessage.id}/reply`);
        }
      }
    },
    {
      key: 'a',
      description: 'Archive message',
      action: () => {
        if (selectedMessage) {
          archiveMessage(selectedMessage.id);
        }
      }
    },
    {
      key: 'Delete',
      description: 'Delete message',
      action: () => {
        if (selectedMessage) {
          deleteMessage(selectedMessage.id);
        }
      }
    },
    {
      key: 'm',
      description: 'Mark as read/unread',
      action: () => {
        if (selectedMessage) {
          markAsRead(selectedMessage.id);
        }
      }
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      shift: true,
      action: () => {
        // Toggle shortcuts help dialog
        document.dispatchEvent(new CustomEvent('toggle-shortcuts-help'));
      }
    }
  ];

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Ignore shortcuts when typing in input fields
    if (['input', 'textarea'].includes(document.activeElement?.tagName.toLowerCase())) {
      return;
    }

    const shortcut = shortcuts.find(s => 
      s.key === e.key &&
      !!s.ctrl === (e.ctrlKey || e.metaKey) &&
      !!s.shift === e.shiftKey &&
      !!s.alt === e.altKey
    );

    if (shortcut) {
      e.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    shortcuts: shortcuts.map(({ key, description, ctrl, shift, alt }) => ({
      key: [
        ctrl && 'Ctrl/⌘',
        shift && 'Shift',
        alt && 'Alt',
        key.toUpperCase()
      ].filter(Boolean).join(' + '),
      description
    }))
  };
}
```