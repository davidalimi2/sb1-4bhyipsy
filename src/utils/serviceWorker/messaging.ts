```typescript
export function sendMessageToSW(message: any) {
  if (!navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage(message);
}

export function listenForSWMessages(callback: (event: MessageEvent) => void) {
  navigator.serviceWorker.addEventListener('message', callback);
  return () => navigator.serviceWorker.removeEventListener('message', callback);
}

export function handleClientMessage(event: ExtendableMessageEvent) {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}
```