```typescript
import React from 'react';
import { Smile, Plus } from 'lucide-react';
import { useMessageReactions } from '../../hooks/messages/useMessageReactions';

interface MessageReactionsProps {
  messageId: string;
}

export function MessageReactions({ messageId }: MessageReactionsProps) {
  const { reactions, addReaction, removeReaction } = useMessageReactions(messageId);
  const [showPicker, setShowPicker] = React.useState(false);

  const commonEmojis = ['👍', '❤️', '😊', '👏', '🎉'];

  return (
    <div className="relative">
      <div className="flex items-center space-x-1">
        {Object.entries(reactions).map(([emoji, users]) => (
          <button
            key={emoji}
            onClick={() => users.includes(auth.uid()) ? removeReaction(emoji) : addReaction(emoji)}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
              users.includes(auth.uid()) 
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800'
            } hover:bg-indigo-200`}
          >
            <span>{emoji}</span>
            <span className="ml-1">{users.length}</span>
          </button>
        ))}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {showPicker ? <Plus className="h-4 w-4" /> : <Smile className="h-4 w-4" />}
        </button>
      </div>

      {showPicker && (
        <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border p-2">
          <div className="grid grid-cols-5 gap-1">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  addReaction(emoji);
                  setShowPicker(false);
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```