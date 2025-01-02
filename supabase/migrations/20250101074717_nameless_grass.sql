-- Add type column to lawsuit_templates if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lawsuit_templates' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE lawsuit_templates 
    ADD COLUMN type text CHECK (type IN ('complaint', 'answer', 'motion', 'brief'));

    -- Add index for type column
    CREATE INDEX IF NOT EXISTS idx_lawsuit_templates_type ON lawsuit_templates(type);
  END IF;
END $$;