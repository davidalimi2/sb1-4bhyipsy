-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read templates" ON templates;
  DROP POLICY IF EXISTS "Users can read template versions" ON template_versions;
  DROP POLICY IF EXISTS "Users can read template categories" ON template_categories;
  DROP POLICY IF EXISTS "Users can read template tags" ON template_tags;
  DROP POLICY IF EXISTS "Users can read template collaborators" ON template_collaborators;
  DROP POLICY IF EXISTS "Users can read template comments" ON template_comments;
END $$;

-- Create or update base templates table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text NOT NULL,
    jurisdiction text,
    content jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create or update related tables
DO $$ 
BEGIN
  -- Template Versions Table
  CREATE TABLE IF NOT EXISTS template_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
    version integer NOT NULL,
    content jsonb NOT NULL,
    changes text,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    UNIQUE(template_id, version)
  );

  -- Template Categories Table
  CREATE TABLE IF NOT EXISTS template_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    parent_id uuid REFERENCES template_categories(id),
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );

  -- Template Tags Table
  CREATE TABLE IF NOT EXISTS template_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
  );

  -- Template Tags Junction Table
  CREATE TABLE IF NOT EXISTS template_tag_relations (
    template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES template_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, tag_id)
  );

  -- Template Collaborators Table
  CREATE TABLE IF NOT EXISTS template_collaborators (
    template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    role text CHECK (role IN ('viewer', 'editor', 'owner')),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (template_id, user_id)
  );

  -- Template Comments Table
  CREATE TABLE IF NOT EXISTS template_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
    version_id uuid REFERENCES template_versions(id),
    user_id uuid REFERENCES users(id),
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies safely
DO $$ 
BEGIN
  -- Templates policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'templates' 
    AND policyname = 'Users can read templates'
  ) THEN
    CREATE POLICY "Users can read templates"
      ON templates FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Template versions policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'template_versions' 
    AND policyname = 'Users can read template versions'
  ) THEN
    CREATE POLICY "Users can read template versions"
      ON template_versions FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM template_collaborators
          WHERE template_collaborators.template_id = template_versions.template_id
          AND template_collaborators.user_id = auth.uid()
        )
      );
  END IF;

  -- Other table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'template_categories' 
    AND policyname = 'Users can read template categories'
  ) THEN
    CREATE POLICY "Users can read template categories"
      ON template_categories FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'template_tags' 
    AND policyname = 'Users can read template tags'
  ) THEN
    CREATE POLICY "Users can read template tags"
      ON template_tags FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'template_collaborators' 
    AND policyname = 'Users can read template collaborators'
  ) THEN
    CREATE POLICY "Users can read template collaborators"
      ON template_collaborators FOR SELECT
      TO authenticated
      USING (
        template_id IN (
          SELECT template_id FROM template_collaborators
          WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'template_comments' 
    AND policyname = 'Users can read template comments'
  ) THEN
    CREATE POLICY "Users can read template comments"
      ON template_comments FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM template_collaborators
          WHERE template_collaborators.template_id = template_comments.template_id
          AND template_collaborators.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create indexes safely
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_versions_template'
  ) THEN
    CREATE INDEX idx_template_versions_template ON template_versions(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_versions_version'
  ) THEN
    CREATE INDEX idx_template_versions_version ON template_versions(version);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_categories_parent'
  ) THEN
    CREATE INDEX idx_template_categories_parent ON template_categories(parent_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_collaborators_template'
  ) THEN
    CREATE INDEX idx_template_collaborators_template ON template_collaborators(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_collaborators_user'
  ) THEN
    CREATE INDEX idx_template_collaborators_user ON template_collaborators(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_comments_template'
  ) THEN
    CREATE INDEX idx_template_comments_template ON template_comments(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_template_comments_version'
  ) THEN
    CREATE INDEX idx_template_comments_version ON template_comments(version_id);
  END IF;
END $$;

-- Create or replace version management functions
CREATE OR REPLACE FUNCTION create_template_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO template_versions (
    template_id,
    version,
    content,
    created_by
  )
  SELECT
    NEW.id,
    COALESCE(
      (SELECT MAX(version) + 1 FROM template_versions WHERE template_id = NEW.id),
      1
    ),
    NEW.content,
    auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS template_version_trigger ON templates;
DROP TRIGGER IF EXISTS template_update_version_trigger ON templates;

-- Create triggers
CREATE TRIGGER template_version_trigger
AFTER INSERT ON templates
FOR EACH ROW
EXECUTE FUNCTION create_template_version();

CREATE TRIGGER template_update_version_trigger
AFTER UPDATE OF content ON templates
FOR EACH ROW
WHEN (OLD.content IS DISTINCT FROM NEW.content)
EXECUTE FUNCTION create_template_version();