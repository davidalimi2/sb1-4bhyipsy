import React from 'react';
import { DocumentTitleField } from './fields/DocumentTitleField';
import { DocumentTypeField } from './fields/DocumentTypeField';
import { DocumentUploadField } from './fields/DocumentUploadField';
import { useDocumentForm } from '../../../hooks/useDocumentForm';
import type { Document } from '../../../types';

interface DocumentFormProps {
  caseId: string;
  initialData?: Partial<Document>;
  onSubmit: (data: FormData) => Promise<void>;
}

export function DocumentForm({ caseId, initialData, onSubmit }: DocumentFormProps) {
  const { formData, setFormData, isSubmitting, handleSubmit } = useDocumentForm({
    caseId,
    initialData,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DocumentTitleField
        value={formData.title}
        onChange={(title) => setFormData({ ...formData, title })}
      />
      
      <DocumentTypeField
        value={formData.type}
        onChange={(type) => setFormData({ ...formData, type })}
      />
      
      <DocumentUploadField
        value={formData.file}
        onChange={(file) => setFormData({ ...formData, file })}
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Document'}
        </button>
      </div>
    </form>
  );
}