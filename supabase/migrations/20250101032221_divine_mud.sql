-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their folders" ON message_folders;
  DROP POLICY IF EXISTS "Users can manage their labels" ON message_labels;
  DROP POLICY IF EXISTS "Users can manage their label assignments" ON message_label_assignments;
  DROP POLICY IF EXISTS "Users can manage their folder assignments" ON message_folder_assignments;
END $$;

-- Create tables if they don't exist
DO $$ 
BEGIN
  -- Message Folders Table
  CREATE TABLE IF NOT EXISTS message_folders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    icon text,
    color text,
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, name)
  );

  -- Message Labels Table
  CREATE TABLE IF NOT EXISTS message_labels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, name)
  );

  -- Message Label Assignments
  CREATE TABLE IF NOT EXISTS message_label_assignments (
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    label_id uuid REFERENCES message_labels(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (message_id, label_id)
  );

  -- Message Folder Assignments
  CREATE TABLE IF NOT EXISTS message_folder_assignments (
    message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
    folder_id uuid REFERENCES message_folders(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (message_id, folder_id)
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE message_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_label_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_folder_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their folders'
  ) THEN
    CREATE POLICY "Users can manage their folders"
      ON message_folders FOR ALL
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their labels'
  ) THEN
    CREATE POLICY "Users can manage their labels"
      ON message_labels FOR ALL
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their label assignments'
  ) THEN
    CREATE POLICY "Users can manage their label assignments"
      ON message_label_assignments FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM messages
          WHERE messages.id = message_label_assignments.message_id
          AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their folder assignments'
  ) THEN
    CREATE POLICY "Users can manage their folder assignments"
      ON message_folder_assignments FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM messages
          WHERE messages.id = message_folder_assignments.message_id
          AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
        )
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_folders_user'
  ) THEN
    CREATE INDEX idx_message_folders_user ON message_folders(user_id);
  END IF;

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
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_folder_assignments_message'
  ) THEN
    CREATE INDEX idx_message_folder_assignments_message ON message_folder_assignments(message_id);
  END IF;
END $$;

-- Insert default folders if they don't exist
INSERT INTO message_folders (user_id, name, icon, position)
SELECT 
  id as user_id,
  unnest(ARRAY['Inbox', 'Sent', 'Drafts', 'Archive']) as name,
  unnest(ARRAY['inbox', 'send', 'file', 'archive']) as icon,
  generate_series(1, 4) as position
FROM users
ON CONFLICT (user_id, name) DO NOTHING;