-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read templates" ON lawsuit_templates;
  DROP POLICY IF EXISTS "Users can manage their drafts" ON lawsuit_drafts;
  DROP POLICY IF EXISTS "lawsuit_templates_read_policy" ON lawsuit_templates;
  DROP POLICY IF EXISTS "lawsuit_drafts_access_policy" ON lawsuit_drafts;
  DROP POLICY IF EXISTS "documents_bucket_policy" ON storage.objects;
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "documents_access_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_public_access" ON storage.objects;
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

-- Create RLS policies with safe CREATE OR REPLACE
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lawsuit_templates' 
    AND policyname = 'lawsuit_templates_read_policy_v2'
  ) THEN
    CREATE POLICY "lawsuit_templates_read_policy_v2"
      ON lawsuit_templates FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lawsuit_drafts' 
    AND policyname = 'lawsuit_drafts_access_policy_v2'
  ) THEN
    CREATE POLICY "lawsuit_drafts_access_policy_v2"
      ON lawsuit_drafts FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM cases
          WHERE cases.id = lawsuit_drafts.case_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lawsuit_templates_type ON lawsuit_templates(type);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_case ON lawsuit_drafts(case_id);
CREATE INDEX IF NOT EXISTS idx_lawsuit_drafts_status ON lawsuit_drafts(status);

-- Set up storage bucket with proper configuration
DO $$
BEGIN
  -- Create bucket with proper limits and MIME types
  INSERT INTO storage.buckets (
    id, 
    name, 
    public, 
    file_size_limit, 
    allowed_mime_types
  )
  VALUES (
    'documents',
    'documents',
    true, -- Make bucket public for easier access
    52428800, -- 50MB limit
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ]
  )
  ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Create storage policies
  CREATE POLICY "documents_public_read"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'documents');

  CREATE POLICY "documents_auth_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_auth_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents')
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_auth_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents');
END $$;

-- Insert default complaint template if it doesn't exist
INSERT INTO lawsuit_templates (type, title, category, jurisdiction, content, questions)
SELECT 
  'complaint',
  'Default Complaint Template',
  'civil',
  'federal',
  '{"sections": ["introduction", "jurisdiction", "parties", "facts", "claims", "prayer"], "elements": []}',
  '[
    {"id": "case_number", "text": "Case Number", "type": "text", "required": true},
    {"id": "court_name", "text": "Court Name", "type": "text", "required": true},
    {"id": "plaintiff_name", "text": "Plaintiff Name", "type": "text", "required": true},
    {"id": "defendant_name", "text": "Defendant Name", "type": "text", "required": true}
  ]'
WHERE NOT EXISTS (
  SELECT 1 FROM lawsuit_templates WHERE type = 'complaint'
);