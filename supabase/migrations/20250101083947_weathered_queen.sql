-- Add location column to tasks table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE tasks ADD COLUMN location text;
  END IF;
END $$;

-- Create index for location column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_location'
  ) THEN
    CREATE INDEX idx_tasks_location ON tasks(location);
  END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "tasks_access_policy" ON tasks;

CREATE POLICY "tasks_access_policy"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = tasks.case_id
      AND (
        cases.client_id = auth.uid() OR 
        cases.lawyer_id = auth.uid() OR
        tasks.assigned_to = auth.uid()
      )
    )
  );