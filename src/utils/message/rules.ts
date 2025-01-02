```typescript
import type { Rule, Message } from '../../types/message';

export function evaluateRule(rule: Rule, message: Message): boolean {
  return rule.conditions.every(condition => {
    const value = message[condition.field as keyof Message];
    
    switch (condition.operator) {
      case 'contains':
        return typeof value === 'string' && value.toLowerCase().includes(condition.value.toLowerCase());
      case 'equals':
        return value === condition.value;
      case 'starts_with':
        return typeof value === 'string' && value.toLowerCase().startsWith(condition.value.toLowerCase());
      case 'ends_with':
        return typeof value === 'string' && value.toLowerCase().endsWith(condition.value.toLowerCase());
      default:
        return false;
    }
  });
}

export function applyRules(message: Message, rules: Rule[]): Message {
  let updatedMessage = { ...message };

  for (const rule of rules) {
    if (!rule.active) continue;

    if (evaluateRule(rule, message)) {
      for (const action of rule.actions) {
        switch (action.type) {
          case 'move_to':
            updatedMessage.folder_id = action.value;
            break;
          case 'label':
            updatedMessage.labels = [...(updatedMessage.labels || []), action.value];
            break;
          case 'mark_as':
            if (action.value === 'read') updatedMessage.read = true;
            if (action.value === 'unread') updatedMessage.read = false;
            break;
          case 'forward_to':
            // Handled separately by the message processor
            break;
        }
      }
    }
  }

  return updatedMessage;
}
```