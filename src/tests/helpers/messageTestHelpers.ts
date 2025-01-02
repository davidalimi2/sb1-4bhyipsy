```typescript
import { supabase } from '../../lib/supabase';
import type { Message } from '../../types/message';

interface TestMessageData extends Partial<Message> {
  subject?: string;
  content?: string;
  parent_id?: string;
}

export async function createTestMessage(data: TestMessageData = {}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const messageData = {
    subject: 'Test Message',
    content: 'Test content',
    sender_id: user.id,
    recipient_id: user.id,
    ...data
  };

  const { data: message, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return message;
}

export async function cleanupTestMessages() {
  const { data: user } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('messages')
    .delete()
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
}
```