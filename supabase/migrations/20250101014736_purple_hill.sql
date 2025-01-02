-- Medical Records Tables

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  provider text,
  record_date timestamptz,
  record_type text CHECK (record_type IN ('visit', 'test', 'imaging', 'prescription', 'other')),
  storage_path text NOT NULL,
  status text CHECK (status IN ('pending', 'analyzed', 'flagged')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical findings table
CREATE TABLE IF NOT EXISTS medical_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  record_id uuid REFERENCES medical_records(id),
  condition text NOT NULL,
  description text,
  severity text CHECK (severity IN ('low', 'medium', 'high')),
  date timestamptz,
  provider text,
  created_at timestamptz DEFAULT now()
);

-- Medical summaries table
CREATE TABLE IF NOT EXISTS medical_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  key_findings jsonb NOT NULL,
  timeline jsonb NOT NULL,
  recommendations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read medical records for their cases"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = medical_records.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage medical records for their cases"
  ON medical_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = medical_records.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read medical findings for their cases"
  ON medical_findings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = medical_findings.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read medical summaries for their cases"
  ON medical_summaries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = medical_summaries.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_case ON medical_records(case_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_status ON medical_records(status);
CREATE INDEX IF NOT EXISTS idx_medical_findings_case ON medical_findings(case_id);
CREATE INDEX IF NOT EXISTS idx_medical_findings_record ON medical_findings(record_id);
CREATE INDEX IF NOT EXISTS idx_medical_summaries_case ON medical_summaries(case_id);