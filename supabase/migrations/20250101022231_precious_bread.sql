-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read discovery requests for their cases" ON discovery;
  DROP POLICY IF EXISTS "Users can create discovery requests for their cases" ON discovery;
  DROP POLICY IF EXISTS "Users can read responses for their cases" ON discovery_responses;
  DROP POLICY IF EXISTS "Users can create responses for their cases" ON discovery_responses;
END $$;

-- Create or update discovery table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
    type text CHECK (type IN ('interrogatory', 'document_request', 'admission_request', 'deposition_notice')),
    description text NOT NULL,
    party text,
    status text CHECK (status IN ('pending', 'completed', 'overdue', 'withdrawn')) DEFAULT 'pending',
    due_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create or update discovery responses table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    discovery_id uuid REFERENCES discovery(id) ON DELETE CASCADE,
    content text NOT NULL,
    documents uuid[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE discovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_responses ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies with safe CREATE OR REPLACE
DO $$ 
BEGIN
  -- Discovery table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery' 
    AND policyname = 'Users can read discovery requests for their cases'
  ) THEN
    CREATE POLICY "Users can read discovery requests for their cases"
      ON discovery FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM cases
          WHERE cases.id = discovery.case_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery' 
    AND policyname = 'Users can create discovery requests for their cases'
  ) THEN
    CREATE POLICY "Users can create discovery requests for their cases"
      ON discovery FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM cases
          WHERE cases.id = discovery.case_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;

  -- Discovery responses table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_responses' 
    AND policyname = 'Users can read responses for their cases'
  ) THEN
    CREATE POLICY "Users can read responses for their cases"
      ON discovery_responses FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM discovery
          JOIN cases ON cases.id = discovery.case_id
          WHERE discovery.id = discovery_responses.discovery_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_responses' 
    AND policyname = 'Users can create responses for their cases'
  ) THEN
    CREATE POLICY "Users can create responses for their cases"
      ON discovery_responses FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM discovery
          JOIN cases ON cases.id = discovery.case_id
          WHERE discovery.id = discovery_responses.discovery_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_case'
  ) THEN
    CREATE INDEX idx_discovery_case ON discovery(case_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_status'
  ) THEN
    CREATE INDEX idx_discovery_status ON discovery(status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_responses_discovery'
  ) THEN
    CREATE INDEX idx_discovery_responses_discovery ON discovery_responses(discovery_id);
  END IF;
END $$;