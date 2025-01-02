/*
  # AI Analysis Tables Migration
  
  1. Tables
    - ai_analysis: Stores AI analysis results
    - ai_suggestions: Stores AI-generated suggestions
    - ai_training_data: Stores training data for AI models
    
  2. Security
    - RLS policies for data access
    - Indexes for performance
*/

-- AI Analysis Table
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

-- AI Suggestions Table
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

-- AI Training Data Table
CREATE TABLE IF NOT EXISTS ai_training_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  input jsonb NOT NULL,
  output jsonb NOT NULL,
  feedback jsonb DEFAULT '{}',
  quality_score float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can read AI analysis for their cases"
  ON ai_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = ai_analysis.case_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can read AI suggestions for their cases"
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

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_ai_analysis_case ON ai_analysis(case_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_document ON ai_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_analysis ON ai_suggestions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ai_training_data_type ON ai_training_data(type);

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

-- Create trigger for AI suggestion generation
CREATE TRIGGER ai_analysis_suggestions_trigger
AFTER INSERT ON ai_analysis
FOR EACH ROW
EXECUTE FUNCTION generate_ai_suggestions();