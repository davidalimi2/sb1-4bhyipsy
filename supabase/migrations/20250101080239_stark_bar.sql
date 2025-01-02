-- Function to initialize case progress analysis
CREATE OR REPLACE FUNCTION initialize_case_progress_analysis(case_id uuid)
RETURNS case_progress_analysis
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_analysis case_progress_analysis;
BEGIN
  INSERT INTO case_progress_analysis (
    case_id,
    status_summary,
    completion_percentage,
    suggested_actions,
    risk_factors,
    next_deadlines,
    required_documents
  ) VALUES (
    case_id,
    'Initial case analysis',
    0,
    '[{"title": "Review case details", "description": "Review all case documents and information"}]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb
  )
  RETURNING * INTO new_analysis;

  RETURN new_analysis;
END;
$$;