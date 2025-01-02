export type TemplateCategory = 'lawsuit' | 'contract' | 'motion' | 'response';

export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  helpText?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  jurisdiction?: string;
  questions: TemplateQuestion[];
  structure: {
    elements: StructureElement[];
  };
  created_at: string;
  updated_at: string;
}

export interface StructureElement {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'quote';
  content: string;
  properties: {
    level?: 1 | 2 | 3;
    ordered?: boolean;
    rows?: number;
    columns?: number;
    citation?: string;
    className?: string;
    [key: string]: any;
  };
}