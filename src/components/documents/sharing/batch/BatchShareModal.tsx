import React, { useState } from 'react';
import { X, Users, Calendar } from 'lucide-react';
import { SharePermissionSelect } from '../SharePermissionSelect';
import type { BatchShareRequest, SharePermission } from '../../../../types';

interface BatchShareModalProps {
  onShare: (request: BatchShareRequest) => Promise<void>;
  onClose: () => void;
  selectedDocuments: string[];
}

export function BatchShareModal({ onShare, onClose, selectedDocuments }: BatchShareModalProps) {
  const [formData, setFormData] = useState<Omit<BatchShareRequest, 'documentIds'>>({
    recipients: [],
    permission: 'view',
    message: '',
  });

  const [recipientInput, setRecipientInput] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleAddRecipient = () => {
    if (recipientInput && !formData.recipients.includes(recipientInput)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipientInput]
      }));
      setRecipientInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onShare({
      ...formData,
      documentIds: selectedDocuments,
      expiresAt: expiryDate ? new Date(expiryDate) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Share Multiple Documents
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recipients
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="email"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddRecipient}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            {formData.recipients.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.recipients.map((recipient) => (
                  <span
                    key={recipient}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                  >
                    {recipient}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        recipients: prev.recipients.filter(r => r !== recipient)
                      }))}
                      className="ml-1 text-indigo-500 hover:text-indigo-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Permission Level
            </label>
            <div className="mt-1">
              <SharePermissionSelect
                value={formData.permission}
                onChange={(permission) => setFormData(prev => ({ ...prev, permission }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date (Optional)
            </label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Add a message to the share notification..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.recipients.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Share Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}