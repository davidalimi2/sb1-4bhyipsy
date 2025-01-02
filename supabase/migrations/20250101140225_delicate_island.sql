-- Add missing columns to tasks table
DO $$ 
BEGIN
  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE tasks ADD COLUMN tags text[] DEFAULT '{}';
    CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING gin(tags);
  END IF;

  -- Add reminder_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'reminder_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN reminder_date timestamptz;
    CREATE INDEX IF NOT EXISTS idx_tasks_reminder_date ON tasks(reminder_date);
  END IF;
END $$;