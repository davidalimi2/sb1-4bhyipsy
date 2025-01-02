```typescript
export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables?: Array<{
    name: string;
    description?: string;
    defaultValue?: string;
  }>;
  category?: string;
  created_at: string;
  updated_at?: string;
}

export interface TemplateVariable {
  name: string;
  value: string;
}
```