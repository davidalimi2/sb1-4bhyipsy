-- Add contract type to lawsuit templates check constraint
ALTER TABLE lawsuit_templates 
DROP CONSTRAINT IF EXISTS lawsuit_templates_type_check;

ALTER TABLE lawsuit_templates 
ADD CONSTRAINT lawsuit_templates_type_check 
CHECK (type IN ('complaint', 'answer', 'motion', 'brief', 'contract'));

-- Insert default contract template
INSERT INTO lawsuit_templates (
  type,
  title,
  category,
  jurisdiction,
  content,
  questions
)
VALUES (
  'contract',
  'Standard Contract Template',
  'contracts',
  'general',
  jsonb_build_object(
    'sections', ARRAY['parties', 'recitals', 'definitions', 'terms', 'conditions', 'signatures'],
    'elements', jsonb_build_array()
  ),
  jsonb_build_array(
    jsonb_build_object(
      'id', 'party1_name',
      'text', 'First Party Name',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'id', 'party2_name',
      'text', 'Second Party Name', 
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'id', 'contract_date',
      'text', 'Contract Date',
      'type', 'date',
      'required', true
    ),
    jsonb_build_object(
      'id', 'contract_purpose',
      'text', 'Purpose of Contract',
      'type', 'text',
      'required', true
    ),
    jsonb_build_object(
      'id', 'contract_term',
      'text', 'Contract Term (in months)',
      'type', 'number',
      'required', true
    )
  )
)
ON CONFLICT (id) DO NOTHING;