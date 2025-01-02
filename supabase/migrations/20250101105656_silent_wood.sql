-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read templates" ON lawsuit_templates;
  DROP POLICY IF EXISTS "Users can manage their drafts" ON lawsuit_drafts;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create lawsuit templates table
CREATE TABLE IF NOT EXISTS lawsuit_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('complaint', 'answer', 'motion', 'brief')),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  content jsonb NOT NULL DEFAULT '{}',
  questions jsonb NOT NULL DEFAULT '[]',
  jurisdiction text NOT NULL DEFAULT 'federal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lawsuit drafts table
CREATE TABLE IF NOT EXISTS lawsuit_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  template_id uuid REFERENCES lawsuit_templates(id),
  type text CHECK (type IN ('complaint', 'answer', 'motion', 'brief')),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  answers jsonb NOT NULL DEFAULT '{}',
  status text CHECK (status IN ('draft', 'final', 'filed')) DEFAULT 'draft',
  jurisdiction text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lawsuit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawsuit_drafts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "lawsuit_templates_read_policy"
  ON lawsuit_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lawsuit_drafts_access_policy"
  ON lawsuit_drafts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = lawsuit_drafts.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lawsuit_templates_type ON lawsuit_templates(type);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_case ON lawsuit_drafts(case_id);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_status ON lawsuit_drafts(status);

-- Insert default complaint template if it doesn't exist
INSERT INTO lawsuit_templates (type, title, category, jurisdiction, content, questions)
SELECT 
  'complaint',
  'Default Complaint Template',
  'civil',
  'federal',
  '{"sections": ["introduction", "jurisdiction", "parties", "facts", "claims", "prayer"]}',
  '[
    {"id": "case_number", "text": "Case Number", "type": "text", "required": true},
    {"id": "court_name", "text": "Court Name", "type": "text", "required": true},
    {"id": "plaintiff_name", "text": "Plaintiff Name", "type": "text", "required": true},
    {"id": "defendant_name", "text": "Defendant Name", "type": "text", "required": true}
  ]'
WHERE NOT EXISTS (
  SELECT 1 FROM lawsuit_templates WHERE type = 'complaint'
);