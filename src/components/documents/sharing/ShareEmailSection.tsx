import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import type { Document, SharePermission } from '../../../types';

interface ShareEmailSectionProps {
  document: Document;
  permission: SharePermission;
}

export function ShareEmailSection({ document, permission }: ShareEmailSectionProps) {
  const [email, setEmail] = useState('');

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement share via email functionality
    console.log('Share with:', email, 'Permission:', permission);
    setEmail('');
  };

  return (
    <form onSubmit={handleShare} className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Share via email
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Share
        </button>
      </div>
    </form>
  );
}