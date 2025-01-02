import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentEditor } from '../../components/documents/editor/DocumentEditor';
import { BackButton } from '../../components/shared/ui/BackButton';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';

export function EditDocumentPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        
        // Get document details
        const { data: doc, error: docError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (docError) throw docError;

        // Get document content if it's a text file
        if (doc.mime_type.startsWith('text/')) {
          const { data, error: contentError } = await supabase.storage
            .from('documents')
            .download(doc.storage_path);

          if (contentError) throw contentError;
          const content = await data.text();
          doc.content = content;
        }

        setDocument(doc);
      } catch (error) {
        console.error('Error fetching document:', error);
        navigate('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Edit: {document.title}
      </h1>

      <DocumentEditor
        documentId={id}
        document={document}
        onSave={() => navigate('/documents')}
      />
    </div>
  );
}