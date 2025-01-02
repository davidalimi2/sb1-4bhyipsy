import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
            notification.type === 'success' ? 'ring-green-500' :
            notification.type === 'error' ? 'ring-red-500' :
            'ring-blue-500'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                )}
                {notification.type === 'error' && (
                  <XCircle className="h-6 w-6 text-red-400" />
                )}
                {notification.type === 'info' && (
                  <AlertCircle className="h-6 w-6 text-blue-400" />
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}