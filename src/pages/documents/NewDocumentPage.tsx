import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentUpload } from '../../components/documents/upload/DocumentUpload';
import { Card } from '../../components/shared/ui/Card';
import { BackButton } from '../../components/shared/ui/BackButton';

export function NewDocumentPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Upload New Document
      </h1>

      <Card>
        <div className="p-6">
          <DocumentUpload
            onSuccess={() => navigate('/documents')}
          />
        </div>
      </Card>
    </div>
  );
}