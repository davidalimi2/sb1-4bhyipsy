```typescript
import type { Template } from '../types/template';

export function exportTemplate(template: Template): string {
  // Remove any sensitive or unnecessary data
  const exportData = {
    title: template.title,
    description: template.description,
    category: template.category,
    jurisdiction: template.jurisdiction,
    questions: template.questions,
    structure: template.structure,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

export function validateTemplateImport(data: any): { valid: boolean; error?: string } {
  // Required fields
  if (!data.title || typeof data.title !== 'string') {
    return { valid: false, error: 'Invalid or missing title' };
  }

  if (!data.category || typeof data.category !== 'string') {
    return { valid: false, error: 'Invalid or missing category' };
  }

  if (!Array.isArray(data.questions)) {
    return { valid: false, error: 'Invalid or missing questions array' };
  }

  if (!data.structure || typeof data.structure !== 'object') {
    return { valid: false, error: 'Invalid or missing structure' };
  }

  // Validate questions
  for (const question of data.questions) {
    if (!question.id || !question.text || !question.type) {
      return { valid: false, error: 'Invalid question format' };
    }
  }

  // Validate structure
  if (!Array.isArray(data.structure.elements)) {
    return { valid: false, error: 'Invalid structure format' };
  }

  for (const element of data.structure.elements) {
    if (!element.id || !element.type || !element.content) {
      return { valid: false, error: 'Invalid structure element format' };
    }
  }

  return { valid: true };
}
```