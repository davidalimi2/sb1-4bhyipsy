-- Tasks Management Tables

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage tasks for their cases" ON tasks;
  DROP POLICY IF EXISTS "Users can manage task comments" ON task_comments;
  DROP POLICY IF EXISTS "Users can manage task reminders" ON task_reminders;
END $$;

-- Create tables if they don't exist
DO $$ 
BEGIN
  -- Tasks Table
  CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    due_date timestamptz NOT NULL,
    priority text CHECK (priority IN ('high', 'medium', 'low')),
    status text CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    reminder_date timestamptz,
    tags text[] DEFAULT '{}'::text[],
    attachments uuid[] DEFAULT '{}'::uuid[]
  );

  -- Task Comments Table
  CREATE TABLE IF NOT EXISTS task_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id),
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
  );

  -- Task Reminders Table
  CREATE TABLE IF NOT EXISTS task_reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
    reminder_date timestamptz NOT NULL,
    sent boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with safe CREATE OR REPLACE
DO $$ 
BEGIN
  -- Tasks policies
  CREATE POLICY "tasks_access_policy"
    ON tasks FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM cases
        WHERE cases.id = tasks.case_id
        AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
      )
    );

  -- Comments policies  
  CREATE POLICY "task_comments_access_policy"
    ON task_comments FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM tasks
        JOIN cases ON cases.id = tasks.case_id
        WHERE tasks.id = task_comments.task_id
        AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
      )
    );

  -- Reminders policies
  CREATE POLICY "task_reminders_access_policy"
    ON task_reminders FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM tasks
        JOIN cases ON cases.id = tasks.case_id
        WHERE tasks.id = task_reminders.task_id
        AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
      )
    );
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_case') THEN
    CREATE INDEX idx_tasks_case ON tasks(case_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_status') THEN
    CREATE INDEX idx_tasks_status ON tasks(status);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_due_date') THEN
    CREATE INDEX idx_tasks_due_date ON tasks(due_date);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_comments_task') THEN
    CREATE INDEX idx_task_comments_task ON task_comments(task_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_reminders_task') THEN
    CREATE INDEX idx_task_reminders_task ON task_reminders(task_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_reminders_date') THEN
    CREATE INDEX idx_task_reminders_date ON task_reminders(reminder_date);
  END IF;
END $$;

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_overdue_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tasks
  SET status = 'overdue'
  WHERE status = 'pending'
  AND due_date < now();
END;
$$;

CREATE OR REPLACE FUNCTION trigger_task_status_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  CREATE TRIGGER task_status_update_trigger
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_task_status_update();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;