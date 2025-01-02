-- Fix task status check constraint and add missing columns
DO $$ 
BEGIN
  -- Drop existing status check constraint if it exists
  ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

  -- Add new status check constraint with correct values
  ALTER TABLE tasks 
  ADD CONSTRAINT tasks_status_check_v2 
  CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue'));

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE tasks ADD COLUMN tags text[] DEFAULT '{}';
    CREATE INDEX IF NOT EXISTS idx_tasks_tags_v2 ON tasks USING gin(tags);
  END IF;

  -- Add reminder_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'reminder_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN reminder_date timestamptz;
    CREATE INDEX IF NOT EXISTS idx_tasks_reminder_date_v2 ON tasks(reminder_date);
  END IF;
END $$;