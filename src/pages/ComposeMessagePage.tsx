import React from 'react';
import { ComposeMessage } from '../components/messages/ComposeMessage';

export function ComposeMessagePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Message</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <ComposeMessage />
      </div>
    </div>
  );
}