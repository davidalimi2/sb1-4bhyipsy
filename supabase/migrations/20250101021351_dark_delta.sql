-- AI Analysis Tables

-- Lawsuit Analysis Table
CREATE TABLE IF NOT EXISTS lawsuit_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id),
  summary text NOT NULL,
  parties jsonb NOT NULL,
  claims jsonb NOT NULL,
  deadlines jsonb NOT NULL,
  legal_analysis jsonb NOT NULL,
  next_steps jsonb NOT NULL,
  jurisdiction text,
  case_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Generated Responses Table
CREATE TABLE IF NOT EXISTS ai_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES lawsuit_analysis(id) ON DELETE CASCADE,
  type text CHECK (type IN ('motion', 'answer', 'brief')),
  content text NOT NULL,
  suggestions jsonb DEFAULT '[]',
  citations jsonb DEFAULT '[]',
  status text CHECK (status IN ('draft', 'review', 'final')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI Question Bank Table
CREATE TABLE IF NOT EXISTS ai_question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  subcategory text,
  question text NOT NULL,
  context jsonb,
  usage_count integer DEFAULT 0,
  effectiveness_score float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- AI Generated Questions Table
CREATE TABLE IF NOT EXISTS ai_generated_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deposition_id uuid REFERENCES deposition_plans(id) ON DELETE CASCADE,
  question text NOT NULL,
  category text NOT NULL,
  importance text CHECK (importance IN ('high', 'medium', 'low')),
  rationale text,
  suggested_exhibits uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Case Progress Analysis Table
CREATE TABLE IF NOT EXISTS case_progress_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  status_summary text NOT NULL,
  completion_percentage integer,
  pending_tasks jsonb DEFAULT '[]',
  suggested_actions jsonb DEFAULT '[]',
  risk_factors jsonb DEFAULT '[]',
  next_deadlines jsonb DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lawsuit_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_progress_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read analysis for their cases"
  ON lawsuit_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = lawsuit_analysis.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read responses for their cases"
  ON ai_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lawsuit_analysis
      JOIN cases ON cases.id = lawsuit_analysis.case_id
      WHERE lawsuit_analysis.id = ai_responses.analysis_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read generated questions for their depositions"
  ON ai_generated_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deposition_plans
      JOIN cases ON cases.id = deposition_plans.case_id
      WHERE deposition_plans.id = ai_generated_questions.deposition_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read progress analysis for their cases"
  ON case_progress_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_progress_analysis.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lawsuit_analysis_case ON lawsuit_analysis(case_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_analysis ON ai_responses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ai_question_bank_category ON ai_question_bank(category);
CREATE INDEX IF NOT EXISTS idx_ai_generated_questions_deposition ON ai_generated_questions(deposition_id);
CREATE INDEX IF NOT EXISTS idx_case_progress_analysis_case ON case_progress_analysis(case_id);

-- Function to update case progress analysis
CREATE OR REPLACE FUNCTION update_case_progress_analysis(case_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO case_progress_analysis (
    case_id,
    status_summary,
    completion_percentage,
    pending_tasks,
    suggested_actions,
    risk_factors,
    next_deadlines,
    updated_at
  )
  VALUES (
    case_id,
    'Case progress analysis pending',
    0,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    now()
  )
  ON CONFLICT (case_id) DO UPDATE
  SET
    updated_at = now();
END;
$$;

-- Trigger to create/update progress analysis when case is modified
CREATE OR REPLACE FUNCTION trigger_case_progress_analysis()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM update_case_progress_analysis(NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER case_progress_analysis_trigger
AFTER INSERT OR UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION trigger_case_progress_analysis();