-- Add missing columns to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS mime_type text,
ADD COLUMN IF NOT EXISTS size bigint;

-- Create index for case_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_case'
  ) THEN
    CREATE INDEX idx_documents_case ON documents(case_id);
  END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read case documents" ON documents;
DROP POLICY IF EXISTS "Users can create case documents" ON documents;

CREATE POLICY "documents_read_policy"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = documents.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "documents_create_policy"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = documents.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );