import { supabase } from '../lib/supabase';
import type { Message } from '../types/message';

interface PendingOperation {
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class SyncManager {
  private pendingOperations: Map<string, PendingOperation> = new Map();

  async queueOperation(type: PendingOperation['type'], data: any) {
    const operationId = crypto.randomUUID();
    const operation: PendingOperation = {
      type,
      data,
      timestamp: Date.now()
    };

    // Store in IndexedDB
    const db = await this.getDatabase();
    await db.put('pendingOperations', operation, operationId);

    this.pendingOperations.set(operationId, operation);
    this.attemptSync();
  }

  private async attemptSync() {
    if (!navigator.onLine) return;

    const operations = Array.from(this.pendingOperations.entries());
    operations.sort((a, b) => a[1].timestamp - b[1].timestamp);

    for (const [id, operation] of operations) {
      try {
        await this.processOperation(operation);
        this.pendingOperations.delete(id);

        // Remove from IndexedDB
        const db = await this.getDatabase();
        await db.delete('pendingOperations', id);
      } catch (error) {
        console.error('Sync failed for operation:', id, error);
      }
    }
  }

  private async processOperation(operation: PendingOperation) {
    switch (operation.type) {
      case 'create':
        await supabase.from('messages').insert(operation.data);
        break;
      case 'update':
        await supabase
          .from('messages')
          .update(operation.data)
          .eq('id', operation.data.id);
        break;
      case 'delete':
        await supabase
          .from('messages')
          .delete()
          .eq('id', operation.data.id);
        break;
    }
  }

  private async getDatabase() {
    return await openDB('syncManager', 1, {
      upgrade(db) {
        db.createObjectStore('pendingOperations');
      }
    });
  }
}

export const syncManager = new SyncManager();