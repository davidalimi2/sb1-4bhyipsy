/*
  # Discovery Templates Migration Fix
  
  1. Changes
    - Safely drops existing policies before recreating
    - Uses DO blocks for safe table creation
    - Adds proper error handling
    - Ensures unique policy names
    
  2. Security
    - Maintains RLS on all tables
    - Recreates necessary policies with unique names
    
  3. Tables
    - discovery_templates
    - discovery_template_sections
    - discovery_template_variables
    - discovery_template_usage
*/

-- Drop existing policies safely
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Templates read access" ON discovery_templates;
  DROP POLICY IF EXISTS "Templates create access" ON discovery_templates;
  DROP POLICY IF EXISTS "Questions read access" ON discovery_template_questions;
  DROP POLICY IF EXISTS "Categories read access" ON discovery_template_categories;
END $$;

-- Create discovery templates table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text CHECK (type IN ('interrogatory', 'document_request', 'admission_request', 'deposition_notice')),
    category_id uuid,
    content jsonb NOT NULL DEFAULT '{}',
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Template Sections Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_template_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES discovery_templates(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    position integer DEFAULT 0,
    is_optional boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Template Variables Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_template_variables (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES discovery_templates(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    default_value text,
    required boolean DEFAULT true,
    validation_pattern text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(template_id, name)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Template Usage Statistics Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_template_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES discovery_templates(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id),
    case_id uuid REFERENCES cases(id),
    used_at timestamptz DEFAULT now(),
    modifications jsonb DEFAULT '{}'
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE discovery_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_template_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_template_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with unique names
DO $$ 
BEGIN
  -- Templates policies
  CREATE POLICY "discovery_templates_read_policy"
    ON discovery_templates FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "discovery_templates_create_policy"
    ON discovery_templates FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

  -- Sections policies
  CREATE POLICY "discovery_sections_read_policy"
    ON discovery_template_sections FOR SELECT
    TO authenticated
    USING (true);

  -- Variables policies
  CREATE POLICY "discovery_variables_read_policy"
    ON discovery_template_variables FOR SELECT
    TO authenticated
    USING (true);

  -- Usage policies
  CREATE POLICY "discovery_usage_read_policy"
    ON discovery_template_usage FOR SELECT
    TO authenticated
    USING (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM discovery_templates
        WHERE discovery_templates.id = discovery_template_usage.template_id
        AND discovery_templates.created_by = auth.uid()
      )
    );
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_discovery_templates_category ON discovery_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_discovery_template_sections_template ON discovery_template_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_discovery_template_sections_position ON discovery_template_sections(position);
CREATE INDEX IF NOT EXISTS idx_discovery_template_variables_template ON discovery_template_variables(template_id);
CREATE INDEX IF NOT EXISTS idx_discovery_template_usage_template ON discovery_template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_discovery_template_usage_user ON discovery_template_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_discovery_template_usage_case ON discovery_template_usage(case_id);