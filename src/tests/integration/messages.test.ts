```typescript
import { test, expect } from 'vitest';
import { supabase } from '../../lib/supabase';
import { useMessageStore } from '../../stores/messageStore';
import { createTestMessage, cleanupTestMessages } from '../helpers/messageTestHelpers';

test('message lifecycle', async () => {
  // Create test message
  const message = await createTestMessage();
  
  try {
    // Test message creation
    expect(message.id).toBeDefined();
    expect(message.subject).toBe('Test Message');

    // Test message retrieval
    const { data: fetchedMessage } = await supabase
      .from('messages')
      .select()
      .eq('id', message.id)
      .single();
      
    expect(fetchedMessage).toBeDefined();
    expect(fetchedMessage?.subject).toBe(message.subject);

    // Test message update
    const { error: updateError } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', message.id);

    expect(updateError).toBeNull();

    // Test message deletion
    const { error: deleteError } = await supabase
      .from('messages')
      .delete()
      .eq('id', message.id);

    expect(deleteError).toBeNull();

  } finally {
    await cleanupTestMessages();
  }
});

test('message threading', async () => {
  const parentMessage = await createTestMessage();
  const replyMessage = await createTestMessage({ 
    parent_id: parentMessage.id,
    subject: 'Re: Test Message'
  });

  try {
    const { data: thread } = await supabase
      .from('messages')
      .select()
      .or(`id.eq.${parentMessage.id},parent_id.eq.${parentMessage.id}`);

    expect(thread).toHaveLength(2);
    expect(thread?.find(m => m.id === replyMessage.id)?.parent_id)
      .toBe(parentMessage.id);

  } finally {
    await cleanupTestMessages();
  }
});

test('message rules', async () => {
  const store = useMessageStore.getState();
  const message = await createTestMessage({
    subject: 'Important: Test Message'
  });

  try {
    // Create test rule
    const { data: rule } = await supabase
      .from('message_rules')
      .insert({
        name: 'Test Rule',
        conditions: [{
          field: 'subject',
          operator: 'contains',
          value: 'Important'
        }],
        actions: [{
          type: 'mark_as',
          value: 'read'
        }]
      })
      .select()
      .single();

    expect(rule).toBeDefined();

    // Verify rule was applied
    const { data: processedMessage } = await supabase
      .from('messages')
      .select()
      .eq('id', message.id)
      .single();

    expect(processedMessage?.read).toBe(true);

  } finally {
    await cleanupTestMessages();
  }
});
```