/*
  # Forum System Tables

  1. New Tables
    - `forum_posts` - Stores forum posts
    - `forum_replies` - Stores replies to posts
    - `forum_tags` - Stores available tags
    - `forum_post_tags` - Junction table for post-tag relationships
    - `forum_moderation_actions` - Stores moderation actions
    - `user_reputation` - Stores user reputation data
    - `reputation_events` - Stores reputation change events

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES users(id),
  category text CHECK (category IN ('general', 'legal_advice', 'resources', 'court_help')),
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum posts"
  ON forum_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Forum Replies Table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES users(id),
  parent_id uuid REFERENCES forum_replies(id),
  is_solution boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum replies"
  ON forum_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum replies"
  ON forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Forum Tags Table
CREATE TABLE IF NOT EXISTS forum_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum tags"
  ON forum_tags FOR SELECT
  TO authenticated
  USING (true);

-- Forum Post Tags Junction Table
CREATE TABLE IF NOT EXISTS forum_post_tags (
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES forum_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE forum_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read post tags"
  ON forum_post_tags FOR SELECT
  TO authenticated
  USING (true);

-- Forum Moderation Actions Table
CREATE TABLE IF NOT EXISTS forum_moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES forum_replies(id) ON DELETE CASCADE,
  action_type text CHECK (action_type IN ('pin', 'lock', 'hide', 'warn', 'delete')),
  reason text NOT NULL,
  moderator_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

ALTER TABLE forum_moderation_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read moderation actions"
  ON forum_moderation_actions FOR SELECT
  TO authenticated
  USING (true);

-- User Reputation Table
CREATE TABLE IF NOT EXISTS user_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) UNIQUE,
  total_points integer DEFAULT 0,
  post_count integer DEFAULT 0,
  solution_count integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  level integer DEFAULT 1,
  badges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read user reputation"
  ON user_reputation FOR SELECT
  TO authenticated
  USING (true);

-- Reputation Events Table
CREATE TABLE IF NOT EXISTS reputation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  event_type text CHECK (event_type IN ('post_created', 'solution_marked', 'helpful_marked', 'post_liked', 'reply_liked')),
  points integer NOT NULL,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reputation events"
  ON reputation_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author ON forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_tags_post ON forum_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_tags_tag ON forum_post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_reputation_events_user ON reputation_events(user_id);