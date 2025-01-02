import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useFileUpload } from '../../../hooks/documents/useFileUpload';
import { useDocuments } from '../../../hooks/useDocuments';
import { generateStoragePath } from '../../../utils/storageUtils';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { useActiveCases } from '../../../hooks/cases/useActiveCases';
import { supabase } from '../../../lib/supabase'; 
import { convertWordToHtml, extractTextFromWord } from '../../../utils/documentConversion';

interface DocumentUploadProps {
  onSuccess?: () => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'filing' | 'evidence' | 'correspondence'>('filing');
  const [caseId, setCaseId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const { uploadDocument } = useDocuments();
  const { cases } = useActiveCases();
  
  const {
    selectedFiles,
    handleFileSelect,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    isDragging,
    reset
  } = useFileUpload({
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFiles.length || !title || !type || !caseId) return;
    
    const file = selectedFiles[0];
    const path = generateStoragePath('documents', file.name);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${caseId}/${timestamp}-${sanitizedName}`;

    setIsAnalyzing(true);
    try {
      setIsUploading(true);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Extract text content if possible
      let content;
      try {
        content = await extractTextContent(file);
      } catch (error) {
        console.warn('Failed to extract text content:', error);
      }

      // Create document record
      await uploadDocument({
        storage_path: path,
        content,
        title,
        type,
        caseId,
        mime_type: file.type,
        size: file.size
      });
      
      reset();
      setTitle('');
      onSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Input
        label="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter document title"
        required
      />

      <Select
        label="Document Type"
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
        required
      >
        <option value="">Select document type</option>
        <option value="filing">Court Filing</option>
        <option value="evidence">Evidence</option>
        <option value="correspondence">Correspondence</option>
      </Select>

      <Select
        label="Associated Case"
        value={caseId}
        onChange={(e) => setCaseId(e.target.value)}
        required
      >
        <option value="">Select a case</option>
        {cases?.map(caseData => (
          <option key={caseData.id} value={caseData.id}>
            {caseData.title}
          </option>
        ))}
      </Select>

      <div
        className={`
          border-2 border-dashed rounded-lg p-6
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          ${selectedFiles.length ? 'bg-gray-50' : 'hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter} 
        onDragLeave={handleDragLeave} 
      >
        {!selectedFiles.length ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your file here, or{' '}
              <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PDF, Word, or Text files up to 10MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {selectedFiles[0].name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div> 
            </div> 
            <div className="flex items-center">
              <button
                onClick={reset}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          loading={isUploading || isAnalyzing}
          disabled={!selectedFiles.length || !title || !type || !caseId}
        >
          {isAnalyzing ? 'Analyzing Document...' : 'Upload Document'}
        </Button>
      </div>
    </div>
  );
}