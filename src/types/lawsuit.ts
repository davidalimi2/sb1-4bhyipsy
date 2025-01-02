export type LawsuitType = 'complaint' | 'answer' | 'motion' | 'brief' | 'contract';

export interface LawsuitTemplate {
  id: string;
  type: LawsuitType;
  title: string;
  description: string;
  jurisdiction: string;
  questions: LawsuitQuestion[];
  structure: {
    elements: StructureElement[];
  };
  created_at: string;
  updated_at: string;
}

export interface LawsuitQuestion {
  id: string;
  text: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  helpText?: string;
  dependsOn?: {
    questionId: string;
    value: any;
  };
}

export interface LawsuitDraft {
  id: string;
  case_id: string;
  template_id: string;
  title: string;
  content: string;
  answers: Record<string, any>;
  status: 'draft' | 'final' | 'filed';
  jurisdiction: string;
  created_at: string;
  updated_at: string;
}

export interface LawsuitAnalysis {
  summary: string;
  parties: {
    plaintiffs: string[];
    defendants: string[];
  };
  claims: Array<{
    type: string;
    description: string;
    elements: string[];
  }>;
  deadlines: Array<{
    date: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  legal_analysis: Array<{
    title: string;
    description: string;
    citations?: string;
  }>;
  next_steps: string[];
  jurisdiction: string;
  case_type: string;
}