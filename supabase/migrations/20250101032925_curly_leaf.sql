-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "message_attachments_access_policy" ON message_attachments;
END $$;

-- Message Attachments Table
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text NOT NULL,
  size bigint NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Create new RLS policy with unique name
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'message_attachments' 
    AND policyname = 'message_attachments_access_policy_v3'
  ) THEN
    CREATE POLICY "message_attachments_access_policy_v3"
      ON message_attachments FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM messages
          WHERE messages.id = message_attachments.message_id
          AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
        )
      );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_message_attachments_message'
  ) THEN
    CREATE INDEX idx_message_attachments_message ON message_attachments(message_id);
  END IF;
END $$;