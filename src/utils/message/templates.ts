```typescript
import type { MessageTemplate, TemplateVariable } from '../../types/message';

export function parseTemplate(template: MessageTemplate, variables: TemplateVariable[] = []): string {
  let content = template.content;

  // Replace variables
  variables.forEach(({ name, value }) => {
    const regex = new RegExp(`{{\\s*${name}\\s*}}`, 'g');
    content = content.replace(regex, value);
  });

  // Replace any remaining variables with empty string
  content = content.replace(/{{.*?}}/g, '');

  return content;
}

export function extractVariables(content: string): string[] {
  const regex = /{{(.*?)}}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const variable = match[1].trim();
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }

  return variables;
}

export function validateTemplate(template: Partial<MessageTemplate>): { valid: boolean; error?: string } {
  if (!template.name?.trim()) {
    return { valid: false, error: 'Template name is required' };
  }

  if (!template.subject?.trim()) {
    return { valid: false, error: 'Template subject is required' };
  }

  if (!template.content?.trim()) {
    return { valid: false, error: 'Template content is required' };
  }

  return { valid: true };
}
```