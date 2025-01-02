```typescript
import { test, expect } from 'vitest';
import { supabase } from '../../lib/supabase';
import { evaluateRule, applyRules } from '../../utils/message/rules';
import { createTestMessage, cleanupTestMessages } from '../helpers/messageTestHelpers';

test('rule evaluation', async () => {
  const message = await createTestMessage({
    subject: 'Important: Test Message',
    content: 'This is a test message'
  });

  try {
    const rule = {
      id: '1',
      name: 'Test Rule',
      active: true,
      conditions: [
        {
          field: 'subject',
          operator: 'contains',
          value: 'Important'
        }
      ],
      actions: [
        {
          type: 'mark_as',
          value: 'read'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const matches = evaluateRule(rule, message);
    expect(matches).toBe(true);

    const updatedMessage = applyRules(message, [rule]);
    expect(updatedMessage.read).toBe(true);

  } finally {
    await cleanupTestMessages();
  }
});

test('rule conditions', async () => {
  const message = await createTestMessage({
    subject: 'Test Message',
    content: 'Urgent: Please review'
  });

  try {
    const rules = [
      {
        id: '1',
        name: 'Subject Rule',
        active: true,
        conditions: [
          {
            field: 'subject',
            operator: 'equals',
            value: 'Test Message'
          }
        ],
        actions: [{ type: 'mark_as', value: 'read' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Content Rule',
        active: true,
        conditions: [
          {
            field: 'content',
            operator: 'contains',
            value: 'Urgent'
          }
        ],
        actions: [{ type: 'mark_as', value: 'read' }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const updatedMessage = applyRules(message, rules);
    expect(updatedMessage.read).toBe(true);

  } finally {
    await cleanupTestMessages();
  }
});
```