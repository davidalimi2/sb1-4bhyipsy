-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "message_labels_access_policy_v4" ON message_labels;
  DROP POLICY IF EXISTS "message_label_assignments_access_policy_v4" ON message_label_assignments;
END $$;

-- Message Labels Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS message_labels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    name text NOT NULL,
    color text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, name)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Message Label Assignments Table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS message_label_assignments (
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    label_id uuid REFERENCES message_labels(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (message_id, label_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE message_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_label_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with safe CREATE OR REPLACE
DO $$ 
BEGIN
  CREATE POLICY "message_labels_access_policy_v4"
    ON message_labels FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

  CREATE POLICY "message_label_assignments_access_policy_v4"
    ON message_label_assignments FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM messages
        WHERE messages.id = message_label_assignments.message_id
        AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
      )
    );
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_labels_user'
  ) THEN
    CREATE INDEX idx_message_labels_user ON message_labels(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_label_assignments_message'
  ) THEN
    CREATE INDEX idx_message_label_assignments_message ON message_label_assignments(message_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_label_assignments_label'
  ) THEN
    CREATE INDEX idx_message_label_assignments_label ON message_label_assignments(label_id);
  END IF;
END $$;