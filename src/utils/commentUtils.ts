import type { Comment, CommentThread } from '../types/comment';

export function sortCommentsByDate(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function groupCommentsByThread(comments: Comment[]): CommentThread[] {
  const threads = new Map<string | undefined, Comment[]>();
  
  for (const comment of comments) {
    const threadId = comment.parentId || comment.id;
    if (!threads.has(threadId)) {
      threads.set(threadId, []);
    }
    threads.get(threadId)!.push(comment);
  }
  
  return Array.from(threads.entries()).map(([id, comments]) => ({
    id: id!,
    comments: sortCommentsByDate(comments),
    status: comments[0].status
  }));
}

export function canEditComment(comment: Comment, userId: string): boolean {
  return comment.author === userId && comment.status === 'active';
}

export function canDeleteComment(comment: Comment, userId: string, isAdmin: boolean): boolean {
  return isAdmin || (comment.author === userId && comment.status === 'active');
}