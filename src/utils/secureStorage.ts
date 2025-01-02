```typescript
import { encryptMessage, decryptMessage } from './encryption';

// Secure storage wrapper with encryption
export class SecureStorage {
  private storage: Storage;
  private keyPrefix: string;
  private encryptionKey: CryptoKey;

  constructor(storage: Storage = localStorage, keyPrefix = 'secure_', key?: CryptoKey) {
    this.storage = storage;
    this.keyPrefix = keyPrefix;
    this.encryptionKey = key;
  }

  async setItem(key: string, value: any): Promise<void> {
    const serialized = JSON.stringify(value);
    const encrypted = await encryptMessage(serialized, this.encryptionKey);
    this.storage.setItem(this.keyPrefix + key, encrypted);
  }

  async getItem<T>(key: string): Promise<T | null> {
    const encrypted = this.storage.getItem(this.keyPrefix + key);
    if (!encrypted) return null;

    try {
      const decrypted = await decryptMessage(encrypted, this.encryptionKey);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(this.keyPrefix + key);
  }

  clear(): void {
    // Only clear items with our prefix
    for (let i = this.storage.length - 1; i >= 0; i--) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.keyPrefix)) {
        this.storage.removeItem(key);
      }
    }
  }

  // Auto-delete expired items
  async cleanExpired(): Promise<void> {
    const now = Date.now();
    for (let i = this.storage.length - 1; i >= 0; i--) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.keyPrefix)) {
        const item = await this.getItem<{ expiresAt?: number }>(
          key.slice(this.keyPrefix.length)
        );
        if (item?.expiresAt && item.expiresAt < now) {
          this.storage.removeItem(key);
        }
      }
    }
  }
}

// Create singleton instance
export const secureStorage = new SecureStorage();
```