// Add to existing types
export interface ThreadNode {
  message: Message;
  children: ThreadNode[];
  level: number;
}