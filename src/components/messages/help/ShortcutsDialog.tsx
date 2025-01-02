```typescript
import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';

export function ShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggle-shortcuts-help', handleToggle);
    return () => document.removeEventListener('toggle-shortcuts-help', handleToggle);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Keyboard className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Navigation</h3>
            <div className="space-y-3">
              {shortcuts.slice(0, 5).map(({ key, description }) => (
                <div key={key} className="flex justify-between">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{key}</kbd>
                  <span className="text-gray-600">{description}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Actions</h3>
            <div className="space-y-3">
              {shortcuts.slice(5).map(({ key, description }) => (
                <div key={key} className="flex justify-between">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{key}</kbd>
                  <span className="text-gray-600">{description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + ?</kbd> to toggle this dialog
        </div>
      </div>
    </div>
  );
}
```