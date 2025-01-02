-- Lawsuit Templates Table
CREATE TABLE IF NOT EXISTS lawsuit_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  jurisdiction text NOT NULL,
  content jsonb NOT NULL,
  questions jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lawsuit Drafts Table
CREATE TABLE IF NOT EXISTS lawsuit_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  template_id uuid REFERENCES lawsuit_templates(id),
  title text NOT NULL,
  content jsonb NOT NULL,
  answers jsonb NOT NULL,
  status text CHECK (status IN ('draft', 'final', 'filed')) DEFAULT 'draft',
  jurisdiction text NOT NULL,
  case_id uuid REFERENCES cases(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lawsuit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawsuit_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read templates"
  ON lawsuit_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their drafts"
  ON lawsuit_drafts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lawsuit_templates_category ON lawsuit_templates(category);
CREATE INDEX IF NOT EXISTS idx_lawsuit_templates_jurisdiction ON lawsuit_templates(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_user ON lawsuit_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_case ON lawsuit_drafts(case_id);