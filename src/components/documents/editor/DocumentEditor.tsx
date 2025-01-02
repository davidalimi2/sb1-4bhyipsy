import React, { useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { Download, FileText, Wand2, Save, File, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { RichTextEditor } from '../../shared/editor/RichTextEditor';
import { AIAssistant } from './AIAssistant';
import { convertToPdf } from '../../../utils/pdfUtils';
import { convertHtmlToWord } from '../../../utils/documentConversion';
import { GrammarChecker } from '../../shared/editor/GrammarChecker';

interface DocumentEditorProps {
  documentId: string;
  document: {
    title: string;
    mime_type: string;
    storage_path: string;
    content?: string;
  };
  onSave?: () => void;
}

export function DocumentEditor({ documentId, document, onSave }: DocumentEditorProps) {
  const [content, setContent] = useState(document.content || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Auto-save every 30 seconds if enabled
  React.useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const interval = setInterval(() => {
      if (content !== document.content) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [content, autoSaveEnabled]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Upload updated content
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .update(document.storage_path, new Blob([content], { type: 'text/plain' }));
      
      if (uploadError) throw uploadError;

      // Update document record
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      onSave?.();
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToPdf = async () => {
    try {
      setIsConverting(true);
      const pdfBlob = await convertToPdf(content);
      
      // Generate PDF filename
      const pdfName = document.title.replace(/\.[^/.]+$/, '') + '.pdf';
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error converting to PDF:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleExportWord = async () => {
    try {
      setIsExportingWord(true);
      const wordBlob = await convertHtmlToWord(content);
      const url = URL.createObjectURL(wordBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Word:', error);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Only show editor for text files
  if (!document.mime_type.startsWith('text/')) {
    return (
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex items-start space-x-3 text-yellow-800 bg-yellow-50 p-4 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-medium">Binary Document</h3>
            <p className="mt-1 text-sm">
              This document type cannot be edited directly in the browser. Please download it to make changes.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<Download className="h-5 w-5" />}
            onClick={() => window.open(document.storage_path, '_blank')}
          >
            Download Document
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon={<FileText className="h-4 w-4" />}
            onClick={handleConvertToPdf}
            loading={isConverting}
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            icon={<File className="h-4 w-4" />}
            onClick={handleExportWord}
            loading={isExportingWord}
          >
            Export Word
          </Button>
          <Button
            variant="secondary"
            icon={<Wand2 className="h-4 w-4" />}
            onClick={() => setIsAnalyzing(true)}
          >
            AI Assist
          </Button>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoSave"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSave" className="text-sm text-gray-600">
              Auto-save
            </label>
          </div>
        </div>
        <Button
          icon={<Save className="h-4 w-4" />}
          onClick={handleSave}
          loading={isSaving}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RichTextEditor
            content={content}
            onChange={setContent}
            className="min-h-[600px]"
            features={[
              'heading',
              'bold',
              'italic',
              'underline',
              'strike',
              'bulletList',
              'orderedList',
              'blockquote',
              'codeBlock',
              'horizontalRule',
              'table',
              'link',
              'image',
              'alignLeft',
              'alignCenter', 
              'alignRight'
            ]}
          />
        </div>
        <div>
          <AIAssistant
            content={content}
            onSuggestion={(suggestion) => {
              setContent(prev => prev + '\n' + suggestion);
            }}
            isAnalyzing={isAnalyzing}
            onClose={() => setIsAnalyzing(false)}
          />
          <GrammarChecker
            content={content}
            onFix={(start, end, replacement) => {
              const newContent = content.substring(0, start) + 
                replacement + 
                content.substring(end);
              setContent(newContent);
            }}
          />
        </div>
      </div>
    </div>
  );
}