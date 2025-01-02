/*
  # Document Versions Schema Update

  1. Changes
    - Add document versions table
    - Add current version reference to documents
    - Enable RLS and add policies
    - Add version restoration function

  2. Security
    - Enable RLS on document_versions table
    - Add policy for reading versions of accessible documents
    - Add secure version restoration function
*/

-- Create document versions table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  version integer NOT NULL,
  storage_path text NOT NULL,
  size bigint NOT NULL,
  comment text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(document_id, version)
);

-- Add current version reference to documents if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'current_version_id'
  ) THEN
    ALTER TABLE documents 
    ADD COLUMN current_version_id uuid REFERENCES document_versions(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read versions of accessible documents" ON document_versions;
  
  CREATE POLICY "Users can read versions of accessible documents"
    ON document_versions
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM documents
        JOIN cases ON cases.id = documents.case_id
        WHERE documents.id = document_versions.document_id
        AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
      )
    );

  CREATE POLICY "Users can create versions of accessible documents"
    ON document_versions
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM documents
        JOIN cases ON cases.id = documents.case_id
        WHERE documents.id = document_versions.document_id
        AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
      )
    );
END $$;

-- Function to restore document version
CREATE OR REPLACE FUNCTION restore_document_version(version_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE documents
  SET current_version_id = version_id,
      updated_at = now()
  WHERE id = (
    SELECT document_id 
    FROM document_versions 
    WHERE id = version_id
  );
END;
$$;