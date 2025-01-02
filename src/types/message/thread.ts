```typescript
import type { Message } from './base';

export interface ThreadNode {
  message: Message;
  children: ThreadNode[];
  level: number;
}
```