import React from 'react';
import { FileText, Download } from 'lucide-react';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { Button } from '../../shared/ui/Button';

interface DocumentViewerProps {
  url: string;
  title: string;
  mimeType: string;
}

export function DocumentViewer({ url, title, mimeType }: DocumentViewerProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify URL is accessible
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load document');

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FileText className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-900 font-medium mb-4">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          icon={<Download className="h-4 w-4" />}
          onClick={() => window.open(url, '_blank')}
        >
          Download Instead
        </Button>
      </div>
    );
  }

  // Handle different document types
  switch (mimeType) {
    case 'application/pdf':
      return (
        <object
          data={url}
          type="application/pdf"
          className="w-full h-[800px]"
          title={title}
        >
          <p>PDF preview not available. Please download to view.</p>
        </object>
      );

    case 'text/plain':
      return (
        <iframe
          src={url}
          title={title}
          className="w-full h-[800px] border-0"
          sandbox="allow-same-origin"
        />
      );

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-900 font-medium mb-2">
            Word documents cannot be previewed directly
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Please download the file to view its contents
          </p>
          <Button
            variant="primary"
            icon={<Download className="h-4 w-4" />}
            onClick={() => window.open(url, '_blank')}
          >
            Download Document
          </Button>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-900 font-medium">Preview not available</p>
          <p className="text-gray-500 text-sm mt-2">
            This file type cannot be previewed in the browser
          </p>
        </div>
      );
  }
}