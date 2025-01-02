```typescript
import { SYNC_CONFIG } from './config';
import { openDB } from 'idb';

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

export async function queueSyncOperation(operation: Omit<SyncOperation, 'id' | 'timestamp'>) {
  const db = await openDB('syncQueue', 1, {
    upgrade(db) {
      db.createObjectStore('operations', { keyPath: 'id' });
    }
  });

  await db.add('operations', {
    id: crypto.randomUUID(),
    ...operation,
    timestamp: Date.now()
  });

  // Request sync if supported
  if ('sync' in registration) {
    await registration.sync.register(SYNC_CONFIG.queueName);
  }
}

export async function processSyncQueue() {
  const db = await openDB('syncQueue', 1);
  const operations = await db.getAll('operations');

  for (const operation of operations) {
    try {
      await processOperation(operation);
      await db.delete('operations', operation.id);
    } catch (error) {
      console.error('Sync failed for operation:', operation.id, error);
    }
  }
}

async function processOperation(operation: SyncOperation) {
  const endpoint = getEndpointForOperation(operation);
  const method = getMethodForOperation(operation.type);

  const response = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(operation.data)
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }
}

function getEndpointForOperation(operation: SyncOperation): string {
  switch (operation.type) {
    case 'create':
      return '/api/messages';
    case 'update':
      return `/api/messages/${operation.data.id}`;
    case 'delete':
      return `/api/messages/${operation.data.id}`;
    default:
      throw new Error(`Unknown operation type: ${operation.type}`);
  }
}

function getMethodForOperation(type: SyncOperation['type']): string {
  switch (type) {
    case 'create':
      return 'POST';
    case 'update':
      return 'PUT';
    case 'delete':
      return 'DELETE';
    default:
      throw new Error(`Unknown operation type: ${type}`);
  }
}
```