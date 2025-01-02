import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { PreviewModal } from './PreviewModal';
import { getMimeType } from '../../../utils/documentUtils';

interface PreviewButtonProps {
  url: string;
  title?: string;
  mimeType?: string;
  disabled?: boolean;
}

export function PreviewButton({ url, title = 'Document Preview', mimeType, disabled }: PreviewButtonProps) {
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);

  // Only show preview for supported types
  const fileType = mimeType || getMimeType(url);
  const isPreviewable = fileType === 'application/pdf' || fileType.startsWith('text/');

  const handlePreview = async () => {
    try {
      setPreviewError(null);
      setShowPreview(true);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Failed to load preview');
      console.error('Preview error:', error);
    }
  };

  if (!isPreviewable) return null;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        icon={<Eye className="h-4 w-4" />}
        onClick={handlePreview}
        disabled={disabled}
      >
        Preview
      </Button>

      {showPreview && !previewError && (
        <PreviewModal
          url={url}
          title={title}
          mimeType={fileType}
          onClose={() => setShowPreview(false)}
        />
      )}
      
      {previewError && (
        <div className="text-sm text-red-600">
          {previewError}
        </div>
      )}
    </>
  );
}