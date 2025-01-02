```typescript
import { Buffer } from 'buffer';

// Use Web Crypto API for cryptographic operations
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  return Buffer.from(exported).toString('base64');
}

export async function importPublicKey(keyStr: string): Promise<CryptoKey> {
  const keyData = Buffer.from(keyStr, 'base64');
  return await window.crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  );
}

export async function encryptMessage(message: string, publicKey: CryptoKey): Promise<string> {
  const data = encoder.encode(message);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    data
  );
  return Buffer.from(encrypted).toString('base64');
}

export async function decryptMessage(encryptedMessage: string, privateKey: CryptoKey): Promise<string> {
  const data = Buffer.from(encryptedMessage, 'base64');
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    data
  );
  return decoder.decode(decrypted);
}
```