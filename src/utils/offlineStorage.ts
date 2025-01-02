import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Message } from '../types/message';

interface MessageDB extends DBSchema {
  messages: {
    key: string;
    value: Message;
    indexes: {
      'by-date': Date;
      'by-sender': string;
      'by-status': string;
    };
  };
  drafts: {
    key: string;
    value: Partial<Message>;
  };
  syncState: {
    key: string;
    value: {
      lastSync: Date;
      version: number;
    };
  };
}

export class OfflineStorage {
  private db!: IDBPDatabase<MessageDB>;

  async init() {
    this.db = await openDB<MessageDB>('messages-db', 1, {
      upgrade(db) {
        // Messages store
        const messageStore = db.createObjectStore('messages', {
          keyPath: 'id'
        });
        messageStore.createIndex('by-date', 'created_at');
        messageStore.createIndex('by-sender', 'sender_id');
        messageStore.createIndex('by-status', 'status');

        // Drafts store
        db.createObjectStore('drafts', { keyPath: 'id' });

        // Sync state store
        db.createObjectStore('syncState', { keyPath: 'id' });
      }
    });
  }

  async saveMessages(messages: Message[]) {
    const tx = this.db.transaction('messages', 'readwrite');
    await Promise.all([
      ...messages.map(message => tx.store.put(message)),
      tx.done
    ]);
  }

  async getMessages() {
    return this.db.getAllFromIndex('messages', 'by-date');
  }

  async saveDraft(draft: Partial<Message>) {
    await this.db.put('drafts', draft);
  }

  async getDrafts() {
    return this.db.getAll('drafts');
  }

  async updateSyncState(lastSync: Date) {
    await this.db.put('syncState', {
      id: 'main',
      lastSync,
      version: 1
    });
  }

  async getSyncState() {
    return this.db.get('syncState', 'main');
  }
}