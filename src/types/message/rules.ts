```typescript
export interface Rule {
  id: string;
  name: string;
  active: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  created_at: string;
  updated_at: string;
}

export interface RuleCondition {
  field: 'subject' | 'sender_id' | 'content';
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with';
  value: string;
}

export interface RuleAction {
  type: 'move_to' | 'label' | 'mark_as' | 'forward_to';
  value: string;
}
```