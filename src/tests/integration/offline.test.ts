```typescript
import { test, expect } from 'vitest';
import { OfflineStorage } from '../../utils/offlineStorage';
import { createTestMessage } from '../helpers/messageTestHelpers';

test('offline storage', async () => {
  const storage = new OfflineStorage();
  await storage.init();

  const message = await createTestMessage();

  try {
    // Test saving messages
    await storage.saveMessages([message]);
    const savedMessages = await storage.getMessages();
    expect(savedMessages).toHaveLength(1);
    expect(savedMessages[0].id).toBe(message.id);

    // Test saving draft
    const draft = {
      id: 'draft-1',
      subject: 'Draft Message',
      content: 'Draft content'
    };
    await storage.saveDraft(draft);
    const savedDrafts = await storage.getDrafts();
    expect(savedDrafts).toHaveLength(1);
    expect(savedDrafts[0].subject).toBe(draft.subject);

    // Test sync state
    const syncDate = new Date();
    await storage.updateSyncState(syncDate);
    const syncState = await storage.getSyncState();
    expect(syncState?.lastSync).toEqual(syncDate);

  } finally {
    // Cleanup
    const db = await storage['db'];
    await db.clear('messages');
    await db.clear('drafts');
    await db.clear('syncState');
  }
});
```