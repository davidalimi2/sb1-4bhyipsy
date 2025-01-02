export type CommentStatus = 'active' | 'resolved' | 'deleted';

export interface Comment {
  id: string;
  documentId: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  status: CommentStatus;
  parentId?: string;
  position?: {
    x: number;
    y: number;
    page?: number;
  };
  metadata?: Record<string, any>;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  status: CommentStatus;
  resolvedBy?: string;
  resolvedAt?: Date;
}