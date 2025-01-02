-- Add reminder_date column to tasks table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'reminder_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN reminder_date timestamptz;
    
    -- Add index for reminder_date column
    CREATE INDEX IF NOT EXISTS idx_tasks_reminder_date ON tasks(reminder_date);
  END IF;
END $$;