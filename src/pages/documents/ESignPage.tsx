import React, { useState } from 'react';
import { FileText, Upload, PenTool } from 'lucide-react';
import { Button } from '../../components/shared/ui/Button';
import { SignatureModal } from '../../components/shared/ui/SignatureModal';
import { PageHeader } from '../../components/shared/ui/PageHeader';
import { Select } from '../../components/shared/ui/Select';
import { useDocuments } from '../../hooks/useDocuments';
import { useActiveCases } from '../../hooks/cases/useActiveCases';
import { Card } from '../../components/shared/ui/Card';
import { useNotifications } from '../../hooks/useNotifications';
import { PDFViewer } from '../../components/documents/viewer/PDFViewer';
import { useDocumentSigning } from '../../hooks/documents/useDocumentSigning';

export function ESignPage() {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { documents } = useDocuments(selectedCaseId);
  const { cases } = useActiveCases();
  const { addNotification } = useNotifications();
  const { signDocument, isSigning } = useDocumentSigning();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addNotification({
          type: 'error',
          title: 'Invalid File Type',
          message: 'Please select a PDF file'
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDocumentSelect = async (docId: string) => {
    const doc = documents?.find(d => d.id === docId);
    if (doc) {
      setSelectedDocId(docId);
      setPreviewUrl(doc.storage_path);
    }
  };

  const handleSignatureComplete = async (signature: string) => {
    try {
      if (!selectedDocId && !selectedFile) {
        throw new Error('No document selected');
      }

      if (selectedDocId) {
        await signDocument({
          documentId: selectedDocId,
          signature,
          position: { x: 0, y: 0, page: 1 } // Default position
        });
      }

      addNotification({
        type: 'success',
        title: 'Document Signed',
        message: 'The document has been signed successfully'
      });

      setShowSignatureModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Signing Failed',
        message: error instanceof Error ? error.message : 'Failed to sign document'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="E-Sign Documents"
        description="Electronically sign and manage your legal documents securely"
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Case Selection and Document List */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Document</h3>
            <div className="space-y-4">
              <Select
                label="Case"
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
              >
                <option value="">Select a case</option>
                {cases?.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </Select>

              {selectedCaseId && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Case Documents</h4>
                  <div className="space-y-2">
                    {documents?.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => handleDocumentSelect(doc.id)}
                        className={`w-full flex items-center p-2 rounded-lg text-left ${
                          selectedDocId === doc.id 
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Or Upload New Document</h4>
                <div className="flex items-center justify-center">
                  <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a PDF</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Document Preview */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
              {previewUrl && (
                <Button 
                  onClick={() => setShowSignatureModal(true)}
                  loading={isSigning}
                >
                  Sign Document
                </Button>
              )}
            </div>
            
            {previewUrl ? (
              <div className="h-[600px] border rounded-lg overflow-hidden">
                <PDFViewer url={previewUrl} title="Document Preview" />
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center border rounded-lg bg-gray-50">
                <div className="text-center">
                  <PenTool className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Select or upload a document to preview and sign
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {showSignatureModal && (
        <SignatureModal
          onClose={() => setShowSignatureModal(false)}
          onSigned={handleSignatureComplete}
        />
      )}
    </div>
  );
}