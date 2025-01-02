import React, { useState } from 'react';
import { Link, Copy, Check } from 'lucide-react';
import { generateShareLink } from '../../../utils/shareUtils';
import type { Document, SharePermission } from '../../../types';

interface ShareLinkSectionProps {
  document: Document;
  permission: SharePermission;
}

export function ShareLinkSection({ document, permission }: ShareLinkSectionProps) {
  const [copied, setCopied] = useState(false);
  const shareLink = generateShareLink(document.id, permission);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Share via link
      </label>
      <div className="flex space-x-2">
        <div className="flex-1 flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
          <Link className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm"
          />
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}