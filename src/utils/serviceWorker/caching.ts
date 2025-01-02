```typescript
import { CACHE_NAME, CACHE_URLS } from './config';

export async function setupCache(): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CACHE_URLS);
}

export async function clearOldCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(cacheName => cacheName !== CACHE_NAME)
      .map(cacheName => caches.delete(cacheName))
  );
}

export async function handleFetch(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request.clone());
  if (shouldCache(response)) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }

  return response;
}

function shouldCache(response: Response): boolean {
  return (
    response.status === 200 &&
    response.type === 'basic' &&
    response.headers.get('content-type')?.includes('text/html')
  );
}
```