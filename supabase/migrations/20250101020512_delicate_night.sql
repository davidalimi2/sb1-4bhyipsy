-- Create base templates table first
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

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

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

CREATE POLICY "Users can read template categories"
  ON template_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read template tags"
  ON template_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read template collaborators"
  ON template_collaborators FOR SELECT
  TO authenticated
  USING (
    template_id IN (
      SELECT template_id FROM template_collaborators
      WHERE user_id = auth.uid()
    )
  );

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_template_versions_template ON template_versions(template_id);
CREATE INDEX IF NOT EXISTS idx_template_versions_version ON template_versions(version);
CREATE INDEX IF NOT EXISTS idx_template_categories_parent ON template_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_template_collaborators_template ON template_collaborators(template_id);
CREATE INDEX IF NOT EXISTS idx_template_collaborators_user ON template_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_template ON template_comments(template_id);
CREATE INDEX IF NOT EXISTS idx_template_comments_version ON template_comments(version_id);

-- Function to create a new template version
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

-- Trigger to create initial version
CREATE TRIGGER template_version_trigger
AFTER INSERT ON templates
FOR EACH ROW
EXECUTE FUNCTION create_template_version();

-- Trigger to create new version on update
CREATE TRIGGER template_update_version_trigger
AFTER UPDATE OF content ON templates
FOR EACH ROW
WHEN (OLD.content IS DISTINCT FROM NEW.content)
EXECUTE FUNCTION create_template_version();