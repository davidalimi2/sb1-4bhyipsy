-- Post Votes Table
CREATE TABLE IF NOT EXISTS forum_post_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  vote_type text CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE forum_post_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own votes"
  ON forum_post_votes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Reply Votes Table
CREATE TABLE IF NOT EXISTS forum_reply_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id uuid REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  vote_type text CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

ALTER TABLE forum_reply_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reply votes"
  ON forum_reply_votes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add vote counts to posts and replies
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0;

ALTER TABLE forum_replies
ADD COLUMN IF NOT EXISTS upvotes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_solution boolean DEFAULT false;

-- Function to update post vote counts
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE forum_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE forum_posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE forum_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE forum_posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Function to update reply vote counts
CREATE OR REPLACE FUNCTION update_reply_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      UPDATE forum_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id;
    ELSE
      UPDATE forum_replies SET downvotes = downvotes + 1 WHERE id = NEW.reply_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      UPDATE forum_replies SET upvotes = upvotes - 1 WHERE id = OLD.reply_id;
    ELSE
      UPDATE forum_replies SET downvotes = downvotes - 1 WHERE id = OLD.reply_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER post_votes_trigger
AFTER INSERT OR DELETE ON forum_post_votes
FOR EACH ROW
EXECUTE FUNCTION update_post_vote_counts();

CREATE TRIGGER reply_votes_trigger
AFTER INSERT OR DELETE ON forum_reply_votes
FOR EACH ROW
EXECUTE FUNCTION update_reply_vote_counts();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_forum_post_votes_post ON forum_post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_votes_user ON forum_post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_reply_votes_reply ON forum_reply_votes(reply_id);
CREATE INDEX IF NOT EXISTS idx_forum_reply_votes_user ON forum_reply_votes(user_id);