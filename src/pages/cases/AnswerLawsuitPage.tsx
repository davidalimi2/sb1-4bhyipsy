import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, AlertCircle, BookOpen, Scale } from 'lucide-react';
import { BackButton } from '../../components/shared/ui/BackButton';
import { Button } from '../../components/shared/ui/Button';
import { Card } from '../../components/shared/ui/Card'; 
import { FileUploadZone } from '../../components/documents/upload/FileUploadZone';
import { RichTextEditor } from '../../components/shared/editor/RichTextEditor';
import { AIAssistant } from '../../components/lawsuits/ai/AIAssistant';
import { useLawsuitAnalysis } from '../../hooks/lawsuits/useLawsuitAnalysis';

export function AnswerLawsuitPage() {
  const { id: caseId } = useParams();
  const [complaintText, setComplaintText] = useState('');
  const [citationFiles, setCitationFiles] = useState<File[]>([]);
  const [answerText, setAnswerText] = useState('');
  const { analyzeLawsuit, generateResponse, analysis, isAnalyzing } = useLawsuitAnalysis();

  const handleAnalyze = async () => {
    if (!complaintText || !citationFiles.length) return;
    await analyzeLawsuit(new File([complaintText], 'complaint.txt'), citationFiles);
  };

  const handleGenerateAnswer = async () => {
    if (!analysis) return;
    const response = await generateResponse(analysis.id);
    setAnswerText(response);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <BackButton to={`/cases/${caseId}`} />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Answer Lawsuit</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload relevant legal citations and enter the complaint text to generate a comprehensive legal response
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {/* Citation Documents */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Legal Citations</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Upload relevant case law, statutes, or precedents to strengthen your response with proper legal authority
              </p>
              <FileUploadZone
                onFileSelect={(file) => setCitationFiles(prev => [...prev, file])}
                onFileError={(error) => {
                  // Handle file error
                }}
              />
              {citationFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {citationFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCitationFiles(prev => prev.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Complaint Input */}
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Scale className="h-5 w-5 text-indigo-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Complaint Analysis</h2>
              </div>
              <RichTextEditor
                content={complaintText}
                onChange={setComplaintText}
                placeholder="Paste or enter the complaint text here for detailed legal analysis..."
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  loading={isAnalyzing}
                  disabled={!complaintText || !citationFiles.length}
                  icon={<FileText className="h-4 w-4" />}
                >
                  Analyze Complaint
                </Button>
              </div>
            </div>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Legal Analysis</h2>
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Case Summary</h3>
                    <p className="mt-1 text-gray-600">{analysis.summary}</p>
                  </div>

                  {/* Claims Analysis */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Claims Analysis</h3>
                    <div className="mt-2 space-y-4">
                      {analysis.claims.map((claim: any, index: number) => (
                        <div key={index} className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-medium text-gray-900">{claim.type}</h4>
                          <p className="text-gray-600">{claim.description}</p>
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                            {claim.elements.map((element: string, i: number) => (
                              <li key={i}>{element}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legal Authority */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Relevant Legal Authority</h3>
                    <div className="mt-2 space-y-2">
                      {analysis.legalAnalysis.map((item: any, index: number) => (
                        <div key={index} className="text-gray-600">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm">{item.description}</p>
                          {item.citations && (
                            <p className="text-sm text-indigo-600 mt-1">{item.citations}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleGenerateAnswer}
                      disabled={!analysis}
                    >
                      Generate Answer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Generated Answer */}
          {answerText && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Answer</h2>
                <RichTextEditor
                  content={answerText}
                  onChange={setAnswerText}
                />
                <div className="mt-4 flex justify-end space-x-3">
                  <Button variant="secondary">
                    Save Draft
                  </Button>
                  <Button>
                    Finalize Answer
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* AI Assistant */}
        <div>
          <div className="sticky top-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Legal Assistant</h2>
                </div>
                <AIAssistant
                  content={complaintText}
                  onSuggestion={(suggestion) => {
                    // Handle suggestion
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}