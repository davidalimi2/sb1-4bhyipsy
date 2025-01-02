-- Forum Notifications Table
CREATE TABLE IF NOT EXISTS forum_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text CHECK (type IN ('mention', 'reply', 'solution', 'like', 'bookmark')),
  post_id uuid REFERENCES forum_posts(id),
  reply_id uuid REFERENCES forum_replies(id),
  actor_id uuid REFERENCES users(id),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON forum_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Forum Bookmarks Table
CREATE TABLE IF NOT EXISTS forum_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  post_id uuid REFERENCES forum_posts(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE forum_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks"
  ON forum_bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add categories table for better organization
CREATE TABLE IF NOT EXISTS forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  slug text NOT NULL UNIQUE,
  icon text,
  color text,
  parent_id uuid REFERENCES forum_categories(id),
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON forum_categories FOR SELECT
  TO authenticated
  USING (true);

-- Add category_id to forum_posts
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES forum_categories(id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_forum_notifications_user ON forum_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_bookmarks_user ON forum_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id);

-- Insert default categories
INSERT INTO forum_categories (name, description, slug, icon, color) VALUES
('General Discussion', 'General discussion about legal matters', 'general', 'message-square', 'blue'),
('Legal Questions', 'Ask specific legal questions', 'legal-questions', 'help-circle', 'green'),
('Resources', 'Share and find legal resources', 'resources', 'book-open', 'purple'),
('Success Stories', 'Share your legal success stories', 'success-stories', 'award', 'yellow'),
('Court Help', 'Get help with court procedures', 'court-help', 'gavel', 'red')
ON CONFLICT (slug) DO NOTHING;