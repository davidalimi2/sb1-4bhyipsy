-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read discovery requests for their cases" ON discovery;
  DROP POLICY IF EXISTS "Users can create discovery requests for their cases" ON discovery;
  DROP POLICY IF EXISTS "Users can read responses for their cases" ON discovery_responses;
  DROP POLICY IF EXISTS "Users can create responses for their cases" ON discovery_responses;
END $$;

-- Create or update discovery table
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

-- Create or update discovery responses table
CREATE TABLE IF NOT EXISTS discovery_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_id uuid REFERENCES discovery(id) ON DELETE CASCADE,
  content text NOT NULL,
  documents uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE discovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_responses ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_discovery_case ON discovery(case_id);
CREATE INDEX IF NOT EXISTS idx_discovery_status ON discovery(status);
CREATE INDEX IF NOT EXISTS idx_discovery_responses_discovery ON discovery_responses(discovery_id);