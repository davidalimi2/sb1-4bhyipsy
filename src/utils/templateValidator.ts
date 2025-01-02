```typescript
import type { Template, StructureElement } from '../types/template';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTemplate(template: Partial<Template>): ValidationResult {
  const errors: string[] = [];

  // Basic info validation
  if (!template.title?.trim()) {
    errors.push('Template title is required');
  }

  if (!template.category) {
    errors.push('Template category is required');
  }

  // Questions validation
  if (!template.questions?.length) {
    errors.push('At least one question is required');
  } else {
    template.questions.forEach((question, index) => {
      if (!question.text?.trim()) {
        errors.push(`Question ${index + 1} text is required`);
      }
      if (!question.type) {
        errors.push(`Question ${index + 1} type is required`);
      }
      if (question.type === 'select' && (!question.options || !question.options.length)) {
        errors.push(`Question ${index + 1} requires at least one option`);
      }
    });
  }

  // Structure validation
  if (!template.structure?.elements?.length) {
    errors.push('Template structure must contain at least one element');
  } else {
    template.structure.elements.forEach((element: StructureElement, index) => {
      if (!element.type) {
        errors.push(`Element ${index + 1} type is required`);
      }
      if (!element.content && element.type !== 'table') {
        errors.push(`Element ${index + 1} content is required`);
      }
      if (element.type === 'heading' && !element.properties.level) {
        errors.push(`Heading element ${index + 1} requires a level`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateStructureElement(element: StructureElement): string[] {
  const errors: string[] = [];

  if (!element.type) {
    errors.push('Element type is required');
  }

  if (!element.content && element.type !== 'table') {
    errors.push('Element content is required');
  }

  switch (element.type) {
    case 'heading':
      if (!element.properties.level || ![1, 2, 3].includes(element.properties.level)) {
        errors.push('Invalid heading level');
      }
      break;

    case 'list':
      try {
        const items = JSON.parse(element.content);
        if (!Array.isArray(items)) {
          errors.push('List content must be an array');
        }
      } catch {
        errors.push('Invalid list content format');
      }
      break;

    case 'table':
      try {
        const data = JSON.parse(element.content || '[]');
        if (!Array.isArray(data) || !data.every(Array.isArray)) {
          errors.push('Invalid table content format');
        }
      } catch {
        errors.push('Invalid table content format');
      }
      break;
  }

  return errors;
}
```