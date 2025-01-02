import React from 'react';
import { FileText, Clock, Download, Eye, PenTool } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { DocumentTypeTag } from './DocumentTypeTag';
import { formatDateTime } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getUrl = async () => {
      try {
        // First check if the document exists in storage
        const { data: exists } = await supabase.storage
          .from('documents')
          .list(document.storage_path.split('/').slice(0, -1).join('/'));

        if (!exists) {
          console.warn('Document not found in storage:', document.storage_path);
          return;
        }

        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.storage_path, 3600);

        if (error) throw error;
        setPreviewUrl(data.signedUrl);
      } catch (err) {
        console.error('Error getting document URL:', err);
        setPreviewUrl(null);
      }
    };

    getUrl();
  }, [document.storage_path]);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {document.title}
              </h4>
              <div className="mt-1 flex items-center gap-2">
                <DocumentTypeTag mimeType={document.mime_type} />
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  document.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  document.status === 'final' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {document.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDateTime(document.updated_at)}</span>
          </div>
          <span>{(document.size / 1024 / 1024).toFixed(1)} MB</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end space-x-2">
          {previewUrl && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={<Eye className="h-4 w-4" />}
                onClick={() => navigate(`/documents/${document.id}/preview`)}
              >
                Preview
              </Button>
              {document.status !== 'signed' && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PenTool className="h-4 w-4" />}
                  onClick={() => navigate(`/documents/esign?id=${document.id}`)}
                >
                  Sign
                </Button>
              )}
            </>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={() => window.open(previewUrl || '', '_blank')}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}