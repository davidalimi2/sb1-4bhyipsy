-- AI Analysis Tables

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "ai_analysis_read_policy" ON ai_analysis;
  DROP POLICY IF EXISTS "ai_suggestions_read_policy" ON ai_suggestions;
END $$;

-- Create or update AI Analysis Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS ai_analysis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
    document_id uuid REFERENCES documents(id),
    type text CHECK (type IN ('lawsuit', 'discovery', 'deposition', 'motion')),
    content jsonb NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create or update AI Suggestions Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS ai_suggestions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id uuid REFERENCES ai_analysis(id) ON DELETE CASCADE,
    type text CHECK (type IN ('action', 'document', 'question', 'citation')),
    content text NOT NULL,
    priority text CHECK (priority IN ('high', 'medium', 'low')),
    metadata jsonb DEFAULT '{}',
    applied boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create or update AI Training Data Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS ai_training_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    input jsonb NOT NULL,
    output jsonb NOT NULL,
    feedback jsonb DEFAULT '{}',
    quality_score float DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies safely
DO $$ 
BEGIN
  -- AI Analysis policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_analysis' 
    AND policyname = 'ai_analysis_read_policy'
  ) THEN
    CREATE POLICY "ai_analysis_read_policy"
      ON ai_analysis FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM cases
          WHERE cases.id = ai_analysis.case_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;

  -- AI Suggestions policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_suggestions' 
    AND policyname = 'ai_suggestions_read_policy'
  ) THEN
    CREATE POLICY "ai_suggestions_read_policy"
      ON ai_suggestions FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM ai_analysis
          JOIN cases ON cases.id = ai_analysis.case_id
          WHERE ai_analysis.id = ai_suggestions.analysis_id
          AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
        )
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_analysis_case'
  ) THEN
    CREATE INDEX idx_ai_analysis_case ON ai_analysis(case_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_analysis_document'
  ) THEN
    CREATE INDEX idx_ai_analysis_document ON ai_analysis(document_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_suggestions_analysis'
  ) THEN
    CREATE INDEX idx_ai_suggestions_analysis ON ai_suggestions(analysis_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_training_data_type'
  ) THEN
    CREATE INDEX idx_ai_training_data_type ON ai_training_data(type);
  END IF;
END $$;

-- Function to update AI suggestions based on analysis
CREATE OR REPLACE FUNCTION generate_ai_suggestions()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a placeholder for the AI suggestion generation logic
  -- In production, this would call an AI service
  INSERT INTO ai_suggestions (
    analysis_id,
    type,
    content,
    priority,
    metadata
  )
  VALUES (
    NEW.id,
    'action',
    'Review and analyze the document',
    'medium',
    '{}'::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS ai_analysis_suggestions_trigger ON ai_analysis;

-- Create trigger for AI suggestion generation
CREATE TRIGGER ai_analysis_suggestions_trigger
AFTER INSERT ON ai_analysis
FOR EACH ROW
EXECUTE FUNCTION generate_ai_suggestions();