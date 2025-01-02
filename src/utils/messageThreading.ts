import type { Message, ThreadNode } from '../types/message';

export function buildThreadTree(messages: Message[]): ThreadNode[] {
  const messageMap = new Map<string, ThreadNode>();
  const rootNodes: ThreadNode[] = [];

  // First pass: create nodes
  messages.forEach(message => {
    messageMap.set(message.id, {
      message,
      children: [],
      level: 0
    });
  });

  // Second pass: build tree
  messages.forEach(message => {
    const node = messageMap.get(message.id)!;
    if (message.parent_id && messageMap.has(message.parent_id)) {
      const parent = messageMap.get(message.parent_id)!;
      parent.children.push(node);
      node.level = parent.level + 1;
    } else {
      rootNodes.push(node);
    }
  });

  // Sort by date within each level
  const sortNodes = (nodes: ThreadNode[]) => {
    nodes.sort((a, b) => 
      new Date(a.message.created_at).getTime() - new Date(b.message.created_at).getTime()
    );
    nodes.forEach(node => {
      if (node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);
  return rootNodes;
}