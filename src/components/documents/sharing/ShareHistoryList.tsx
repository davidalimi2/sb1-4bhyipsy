import React from 'react';
import { Clock, Mail, Link as LinkIcon, XCircle } from 'lucide-react';
import type { ShareHistory } from '../../../types';

interface ShareHistoryListProps {
  history: ShareHistory[];
  onRevoke: (historyId: string) => void;
}

export function ShareHistoryList({ history, onRevoke }: ShareHistoryListProps) {
  if (!history.length) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No sharing history</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 text-sm"
        >
          <div className="flex items-center space-x-3">
            {item.type === 'email' ? (
              <Mail className="h-4 w-4 text-gray-400" />
            ) : (
              <LinkIcon className="h-4 w-4 text-gray-400" />
            )}
            <div>
              <p className="text-gray-900">{item.sharedWith}</p>
              <p className="text-gray-500 text-xs">
                <Clock className="inline-block h-3 w-3 mr-1" />
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              item.permission === 'view' ? 'bg-blue-100 text-blue-800' :
              item.permission === 'edit' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.permission}
            </span>
            
            {!item.revokedAt && (
              <button
                onClick={() => onRevoke(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}