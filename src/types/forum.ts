// Add to existing types
export interface ForumModerationAction {
  id: string;
  post_id?: string;
  reply_id?: string;
  action_type: 'pin' | 'lock' | 'hide' | 'warn' | 'delete';
  reason: string;
  moderator_id: string;
  created_at: string;
}

export interface UserReputation {
  id: string;
  user_id: string;
  total_points: number;
  post_count: number;
  solution_count: number;
  helpful_count: number;
  level: number;
  badges: string[];
}

export interface ReputationEvent {
  id: string;
  user_id: string;
  event_type: 'post_created' | 'solution_marked' | 'helpful_marked' | 'post_liked' | 'reply_liked';
  points: number;
  created_at: string;
  reference_id?: string;
}