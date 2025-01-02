-- Add assigned_to column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES users(id);

-- Create index for assigned_to column
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- Update RLS policies to include assigned_to access
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