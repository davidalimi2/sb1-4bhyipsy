```typescript
export type ContactType = 'client' | 'opposing_counsel' | 'witness' | 'expert' | 'other';

export interface Contact {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  organization?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseContact {
  case_id: string;
  contact_id: string;
  role: string;
  notes?: string;
  created_at: string;
  contact?: Contact;
}

export interface NewContactData {
  full_name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  organization?: string;
  notes?: string;
}
```