import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SharePermissionSelect } from './SharePermissionSelect';
import { ShareLinkSection } from './ShareLinkSection';
import { ShareEmailSection } from './ShareEmailSection';
import type { Document, SharePermission } from '../../../types';

interface DocumentShareModalProps {
  document: Document;
  onClose: () => void;
}

export function DocumentShareModal({ document, onClose }: DocumentShareModalProps) {
  const [permission, setPermission] = useState<SharePermission>('view');

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Share Document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <SharePermissionSelect
            value={permission}
            onChange={setPermission}
          />
          
          <ShareLinkSection
            document={document}
            permission={permission}
          />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <ShareEmailSection
            document={document}
            permission={permission}
          />
        </div>
      </div>
    </div>
  );
}