import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { DocumentShareModal } from './DocumentShareModal';
import type { Document } from '../../../types';

interface DocumentShareButtonProps {
  document: Document;
}

export function DocumentShareButton({ document }: DocumentShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900"
      >
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </button>

      {isModalOpen && (
        <DocumentShareModal
          document={document}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}