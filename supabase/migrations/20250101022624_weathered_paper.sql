/*
  # Discovery Templates Migration
  
  1. New Tables
    - `discovery_templates` for storing reusable discovery request templates
    - `discovery_template_questions` for template questions
    - `discovery_template_categories` for organizing templates
  
  2. Changes
    - Adds template support to discovery system
    - Adds categorization and organization features
    - Improves discovery request management
    
  3. Security
    - Enables RLS on all new tables
    - Adds appropriate access policies
*/

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

-- Create template questions table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_template_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id uuid REFERENCES discovery_templates(id) ON DELETE CASCADE,
    question text NOT NULL,
    help_text text,
    required boolean DEFAULT false,
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create template categories table if it doesn't exist
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS discovery_template_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    parent_id uuid REFERENCES discovery_template_categories(id),
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE discovery_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_template_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_template_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies safely
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_templates' 
    AND policyname = 'Users can read discovery templates'
  ) THEN
    CREATE POLICY "Users can read discovery templates"
      ON discovery_templates FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_templates' 
    AND policyname = 'Users can create discovery templates'
  ) THEN
    CREATE POLICY "Users can create discovery templates"
      ON discovery_templates FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_template_questions' 
    AND policyname = 'Users can read template questions'
  ) THEN
    CREATE POLICY "Users can read template questions"
      ON discovery_template_questions FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'discovery_template_categories' 
    AND policyname = 'Users can read template categories'
  ) THEN
    CREATE POLICY "Users can read template categories"
      ON discovery_template_categories FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes safely
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_templates_category'
  ) THEN
    CREATE INDEX idx_discovery_templates_category ON discovery_templates(category_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_template_questions_template'
  ) THEN
    CREATE INDEX idx_discovery_template_questions_template ON discovery_template_questions(template_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_template_questions_position'
  ) THEN
    CREATE INDEX idx_discovery_template_questions_position ON discovery_template_questions(position);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_template_categories_parent'
  ) THEN
    CREATE INDEX idx_discovery_template_categories_parent ON discovery_template_categories(parent_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_discovery_template_categories_position'
  ) THEN
    CREATE INDEX idx_discovery_template_categories_position ON discovery_template_categories(position);
  END IF;
END $$;

-- Insert default categories if they don't exist
INSERT INTO discovery_template_categories (name, description)
VALUES
  ('General Interrogatories', 'Standard interrogatory templates for various case types'),
  ('Document Requests', 'Common document request templates'),
  ('Requests for Admission', 'Templates for admission requests'),
  ('Deposition Notices', 'Standard deposition notice templates')
ON CONFLICT (name) DO NOTHING;