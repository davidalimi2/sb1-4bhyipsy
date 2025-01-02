import React, { useState } from 'react';
import { useDepositionPrep } from '../../hooks/depositions/useDepositionPrep';
import { QuestionList } from './QuestionList';
import { ObjectivesList } from './ObjectivesList';
import { DocumentList } from './DocumentList';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { RichTextEditor } from '../shared/editor/RichTextEditor';
import { AIAssistant } from '../lawsuits/ai/AIAssistant';

interface DepositionPrepProps {
  caseId: string;
  caseType: string;
}

export function DepositionPrep({ caseId, caseType }: DepositionPrepProps) {
  const { generateQuestions, savePlan, isLoading } = useDepositionPrep(caseId);
  const [deponentName, setDeponentName] = useState('');
  const [deponentRole, setDeponentRole] = useState('');
  const [date, setDate] = useState('');
  const [keyIssues, setKeyIssues] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleGenerateQuestions = async () => {
    if (!deponentRole || keyIssues.length === 0) return;

    const generatedQuestions = await generateQuestions({
      caseType,
      deponentRole,
      keyIssues
    });
    setQuestions(generatedQuestions);
  };

  const handleSave = async () => {
    if (!deponentName || questions.length === 0) return;

    await savePlan({
      caseId,
      deponentName,
      date,
      questions,
      objectives,
      documents,
      notes
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Deponent Name"
          value={deponentName}
          onChange={(e) => setDeponentName(e.target.value)}
          required
        />
        <Select
          label="Deponent Role"
          value={deponentRole}
          onChange={(e) => setDeponentRole(e.target.value)}
          required
        >
          <option value="">Select role</option>
          <option value="witness">Witness</option>
          <option value="expert">Expert</option>
          <option value="party">Party</option>
        </Select>
        <Input
          type="date"
          label="Deposition Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Issues</h3>
        <div className="space-y-2">
          {keyIssues.map((issue, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={issue}
                onChange={(e) => {
                  const newIssues = [...keyIssues];
                  newIssues[index] = e.target.value;
                  setKeyIssues(newIssues);
                }}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  setKeyIssues(keyIssues.filter((_, i) => i !== index));
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() => setKeyIssues([...keyIssues, ''])}
          >
            Add Issue
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerateQuestions}
          loading={isLoading}
          disabled={!deponentRole || keyIssues.length === 0}
        >
          Generate Questions
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <QuestionList
            questions={questions}
            onChange={setQuestions}
          />
        </div>
        <div className="space-y-8">
          <ObjectivesList
            objectives={objectives}
            onChange={setObjectives}
          />
          <DocumentList
            documents={documents}
            onChange={setDocuments}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
        <RichTextEditor
          content={notes}
          onChange={setNotes}
          placeholder="Add preparation notes..."
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={isLoading}
          disabled={!deponentName || questions.length === 0}
        >
          Save Plan
        </Button>
      </div>
    </div>
  );
}