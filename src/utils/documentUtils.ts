import type { Document } from '../types/document';

export function getLegalHeading(type: string, caseTitle?: string): string {
  if (!type.includes('motion') && !type.includes('brief')) {
    return '';
  }

  return `
IN THE DISTRICT COURT

${caseTitle || '[CASE TITLE]'}

Case No. [CASE NUMBER]

[DOCUMENT TITLE]

______________________________________________________________________________

`;
}

export function filterDocuments(documents: Document[], searchQuery: string): Document[] {
  if (!searchQuery) return documents;
  
  const query = searchQuery.toLowerCase();
  return documents.filter(doc => 
    doc.title.toLowerCase().includes(query) ||
    doc.type.toLowerCase().includes(query) ||
    doc.status.toLowerCase().includes(query)
  );
}

export function getDocumentTypeLabel(type: Document['type']): string {
  const labels: Record<Document['type'], string> = {
    filing: 'Court Filing',
    evidence: 'Evidence',
    correspondence: 'Correspondence'
  };
  return labels[type];
}

export function canEditDocument(document: Document): boolean {
  return document.status === 'draft';
}

export function canDeleteDocument(document: Document): boolean {
  return document.status === 'draft';
}

export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain'
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}