/*
  # Forum Analytics Schema

  1. New Tables
    - `forum_analytics` - Stores aggregated forum statistics
    - `tag_analytics` - Stores tag usage statistics

  2. Functions
    - `calculate_tag_trend()` - Calculates tag trending score
    - `update_forum_analytics()` - Updates forum statistics
    - `update_tag_analytics()` - Updates tag statistics

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Function to calculate tag trend score (must be defined first)
CREATE OR REPLACE FUNCTION calculate_tag_trend(
  total_count bigint,
  recent_count bigint
)
RETURNS float
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- If no posts, return 0
  IF total_count = 0 THEN
    RETURN 0;
  END IF;

  -- Calculate trend score based on recent activity percentage and total volume
  -- Formula: (recent_posts / total_posts) * log(total_posts + 1)
  RETURN (recent_count::float / total_count::float) * ln(total_count + 1);
END;
$$;

-- Forum Analytics Table
CREATE TABLE IF NOT EXISTS forum_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_posts integer DEFAULT 0,
  total_replies integer DEFAULT 0,
  active_users integer DEFAULT 0,
  posts_today integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum analytics"
  ON forum_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Tag Analytics Table
CREATE TABLE IF NOT EXISTS tag_analytics (
  tag_id uuid REFERENCES forum_tags(id) ON DELETE CASCADE,
  total_posts integer DEFAULT 0,
  posts_last_30_days integer DEFAULT 0,
  trend_score float DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (tag_id)
);

ALTER TABLE tag_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tag analytics"
  ON tag_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Function to update forum analytics
CREATE OR REPLACE FUNCTION update_forum_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_start timestamptz := date_trunc('day', now());
  thirty_days_ago timestamptz := now() - interval '30 days';
BEGIN
  -- Create or update forum analytics record
  INSERT INTO forum_analytics (
    total_posts,
    total_replies,
    active_users,
    posts_today,
    updated_at
  )
  SELECT
    (SELECT count(*) FROM forum_posts),
    (SELECT count(*) FROM forum_replies),
    (SELECT count(DISTINCT author_id) FROM forum_posts WHERE created_at >= thirty_days_ago),
    (SELECT count(*) FROM forum_posts WHERE created_at >= today_start),
    now()
  ON CONFLICT (id) DO UPDATE
  SET
    total_posts = EXCLUDED.total_posts,
    total_replies = EXCLUDED.total_replies,
    active_users = EXCLUDED.active_users,
    posts_today = EXCLUDED.posts_today,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Function to update tag analytics
CREATE OR REPLACE FUNCTION update_tag_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  thirty_days_ago timestamptz := now() - interval '30 days';
BEGIN
  -- Update tag analytics for all tags
  INSERT INTO tag_analytics (
    tag_id,
    total_posts,
    posts_last_30_days,
    trend_score,
    updated_at
  )
  SELECT
    t.id,
    count(pt.post_id),
    count(CASE WHEN p.created_at >= thirty_days_ago THEN 1 END),
    calculate_tag_trend(
      count(pt.post_id),
      count(CASE WHEN p.created_at >= thirty_days_ago THEN 1 END)
    ),
    now()
  FROM forum_tags t
  LEFT JOIN forum_post_tags pt ON pt.tag_id = t.id
  LEFT JOIN forum_posts p ON p.id = pt.post_id
  GROUP BY t.id
  ON CONFLICT (tag_id) DO UPDATE
  SET
    total_posts = EXCLUDED.total_posts,
    posts_last_30_days = EXCLUDED.posts_last_30_days,
    trend_score = EXCLUDED.trend_score,
    updated_at = EXCLUDED.updated_at;
END;
$$;

-- Create triggers to update analytics
CREATE OR REPLACE FUNCTION trigger_update_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM update_forum_analytics();
  PERFORM update_tag_analytics();
  RETURN NEW;
END;
$$;

CREATE TRIGGER forum_posts_analytics_trigger
AFTER INSERT OR DELETE OR UPDATE ON forum_posts
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_analytics();

CREATE TRIGGER forum_replies_analytics_trigger
AFTER INSERT OR DELETE OR UPDATE ON forum_replies
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_analytics();

CREATE TRIGGER forum_post_tags_analytics_trigger
AFTER INSERT OR DELETE ON forum_post_tags
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_analytics();

-- Initialize analytics
SELECT update_forum_analytics();
SELECT update_tag_analytics();