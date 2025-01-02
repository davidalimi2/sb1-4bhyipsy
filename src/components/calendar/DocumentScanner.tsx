import React, { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentDates } from '../../hooks/calendar/useDocumentDates';
import { useNotifications } from '../../hooks/useNotifications';
import { useCreateEvent } from '../../hooks/calendar/useCreateEvent';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';

export function DocumentScanner() {
  const [selectedDoc, setSelectedDoc] = useState('');
  const { documents } = useDocuments();
  const { scanDocument, isScanning } = useDocumentDates();
  const { createEvent } = useCreateEvent();
  const { addNotification } = useNotifications();

  const handleScan = async () => {
    if (!selectedDoc) return;

    // Get document case ID first
    const doc = documents?.find(d => d.id === selectedDoc);
    if (!doc?.case_id) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Document must be associated with a case'
      });
      return;
    }

    const events = await scanDocument(selectedDoc);
    
    // Create calendar events for extracted dates
    await Promise.all(
      events.map(event => createEvent({
        title: event.title,
        date: event.date,
        type: event.type,
        priority: event.priority,
        description: event.description,
        location: event.location,
        caseId: doc.case_id
      }))
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
        Scan Documents for Dates
      </h3>

      <div className="space-y-4">
        <Select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full"
        >
          <option value="">Select a document</option>
          {documents?.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.title}</option>
          ))}
        </Select>

        <Button
          onClick={handleScan}
          disabled={!selectedDoc || isScanning}
          fullWidth
          icon={isScanning ? <LoadingSpinner size="sm" /> : <FileText className="h-4 w-4" />}
        >
          {isScanning ? 'Scanning...' : 'Scan for Dates'}
        </Button>
      </div>
    </div>
  );
}