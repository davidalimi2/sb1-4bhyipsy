import { useState } from 'react';
import { Keyboard } from 'lucide-react';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';

export function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2"
      >
        <Keyboard className="w-5 h-5" />
        <span>Keyboard Shortcuts</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-2">Global</h3>
                <div className="space-y-2">
                  {shortcuts.global.map(({ key, description }) => (
                    <div key={key} className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{key}</kbd>
                      <span className="text-gray-600">{description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Message Actions</h3>
                <div className="space-y-2">
                  {shortcuts.message.map(({ key, description }) => (
                    <div key={key} className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{key}</kbd>
                      <span className="text-gray-600">{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}