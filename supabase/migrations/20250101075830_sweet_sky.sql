-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "forum_posts_tags_read_policy" ON forum_posts;
  DROP POLICY IF EXISTS "Anyone can read forum post tags" ON forum_posts;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'forum_posts' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE forum_posts ADD COLUMN tags uuid[] DEFAULT '{}';
  END IF;
END $$;

-- Create index for tags if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_forum_posts_tags'
  ) THEN
    CREATE INDEX idx_forum_posts_tags ON forum_posts USING gin(tags);
  END IF;
END $$;

-- Create new policy with unique name
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'forum_posts' 
    AND policyname = 'forum_posts_tags_access_policy'
  ) THEN
    CREATE POLICY "forum_posts_tags_access_policy"
      ON forum_posts FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;