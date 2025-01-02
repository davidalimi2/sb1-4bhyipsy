import React from 'react';
import { Plus } from 'lucide-react';
import { DocumentList } from '../components/documents/DocumentList';
import { Button } from '../components/shared/ui/Button';
import { SignatureModal } from '../components/shared/ui/SignatureModal';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/shared/ui/PageHeader';
import { useState } from 'react';

export function DocumentsPage() {
  const navigate = useNavigate();
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Documents"
        description="Upload, manage and share your legal documents"
        action={
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/documents/esign')}
            >
              E-Sign Document
            </Button>
            <Button
              href="/documents/new"
              icon={<Plus className="h-4 w-4" />}
            >
              New Document
            </Button>
          </div>
        }
      />

      <DocumentList />
      
      {showSignatureModal && (
        <SignatureModal
          onClose={() => setShowSignatureModal(false)}
          onSigned={(signature) => {
            // Handle signed document
            console.log('Document signed:', signature);
            setShowSignatureModal(false);
          }}
        />
      )}
    </div>
  );
}