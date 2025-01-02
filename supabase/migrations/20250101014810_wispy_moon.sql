-- Deposition Tables

-- Deposition plans table
CREATE TABLE IF NOT EXISTS deposition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  deponent_name text NOT NULL,
  deponent_role text CHECK (deponent_role IN ('witness', 'expert', 'party')),
  date timestamptz,
  questions jsonb NOT NULL DEFAULT '[]',
  objectives text[] DEFAULT '{}',
  documents uuid[] DEFAULT '{}',
  notes text,
  status text CHECK (status IN ('draft', 'final', 'completed')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deposition transcripts table
CREATE TABLE IF NOT EXISTS deposition_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES deposition_plans(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  content text,
  key_points jsonb DEFAULT '[]',
  exhibits jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deposition exhibits table
CREATE TABLE IF NOT EXISTS deposition_exhibits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id uuid REFERENCES deposition_transcripts(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id),
  exhibit_number text NOT NULL,
  description text,
  page_references jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deposition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposition_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposition_exhibits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read deposition plans for their cases"
  ON deposition_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = deposition_plans.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage deposition plans for their cases"
  ON deposition_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = deposition_plans.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read deposition transcripts"
  ON deposition_transcripts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deposition_plans
      JOIN cases ON cases.id = deposition_plans.case_id
      WHERE deposition_plans.id = deposition_transcripts.plan_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read deposition exhibits"
  ON deposition_exhibits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deposition_transcripts
      JOIN deposition_plans ON deposition_plans.id = deposition_transcripts.plan_id
      JOIN cases ON cases.id = deposition_plans.case_id
      WHERE deposition_transcripts.id = deposition_exhibits.transcript_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deposition_plans_case ON deposition_plans(case_id);
CREATE INDEX IF NOT EXISTS idx_deposition_plans_status ON deposition_plans(status);
CREATE INDEX IF NOT EXISTS idx_deposition_transcripts_plan ON deposition_transcripts(plan_id);
CREATE INDEX IF NOT EXISTS idx_deposition_exhibits_transcript ON deposition_exhibits(transcript_id);
CREATE INDEX IF NOT EXISTS idx_deposition_exhibits_document ON deposition_exhibits(document_id);