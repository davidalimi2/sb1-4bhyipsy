```typescript
export const CACHE_NAME = 'legal-assistant-v1';

export const CACHE_URLS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css'
];

export const API_CACHE_CONFIG = {
  cacheName: 'api-cache',
  maxEntries: 100,
  maxAgeSeconds: 24 * 60 * 60 // 24 hours
};

export const STATIC_CACHE_CONFIG = {
  cacheName: 'static-assets',
  maxEntries: 60,
  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
};

export const SYNC_CONFIG = {
  queueName: 'messageOperations',
  maxRetentionTime: 24 * 60 // 24 hours
};
```