-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their templates" ON message_templates;
END $$;

-- Message Templates Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS message_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    name text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    variables jsonb DEFAULT '[]',
    category text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy with unique name
DO $$ 
BEGIN
  CREATE POLICY "message_templates_access_policy"
    ON message_templates FOR ALL
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_templates_user'
  ) THEN
    CREATE INDEX idx_message_templates_user ON message_templates(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_templates_category'
  ) THEN
    CREATE INDEX idx_message_templates_category ON message_templates(category);
  END IF;
END $$;