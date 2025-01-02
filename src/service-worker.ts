```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { setupCache, clearOldCaches, handleFetch } from './utils/serviceWorker/caching';
import { processSyncQueue } from './utils/serviceWorker/sync';
import { handleClientMessage } from './utils/serviceWorker/messaging';
import { 
  API_CACHE_CONFIG, 
  STATIC_CACHE_CONFIG,
  SYNC_CONFIG 
} from './utils/serviceWorker/config';

declare let self: ServiceWorkerGlobalScope;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache static assets
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new CacheFirst({
    cacheName: STATIC_CACHE_CONFIG.cacheName,
    plugins: [
      new ExpirationPlugin({
        maxEntries: STATIC_CACHE_CONFIG.maxEntries,
        maxAgeSeconds: STATIC_CACHE_CONFIG.maxAgeSeconds
      })
    ]
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/messages'),
  new NetworkFirst({
    cacheName: API_CACHE_CONFIG.cacheName,
    plugins: [
      new ExpirationPlugin({
        maxEntries: API_CACHE_CONFIG.maxEntries,
        maxAgeSeconds: API_CACHE_CONFIG.maxAgeSeconds
      })
    ]
  })
);

// Background sync for message operations
const bgSyncPlugin = new BackgroundSyncPlugin(SYNC_CONFIG.queueName, {
  maxRetentionTime: SYNC_CONFIG.maxRetentionTime
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/messages'),
  new NetworkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

// Event listeners
self.addEventListener('install', event => {
  event.waitUntil(setupCache());
});

self.addEventListener('activate', event => {
  event.waitUntil(clearOldCaches());
});

self.addEventListener('fetch', event => {
  event.respondWith(handleFetch(event.request));
});

self.addEventListener('sync', event => {
  if (event.tag === SYNC_CONFIG.queueName) {
    event.waitUntil(processSyncQueue());
  }
});

self.addEventListener('message', handleClientMessage);
```