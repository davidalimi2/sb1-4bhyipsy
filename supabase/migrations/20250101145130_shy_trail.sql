-- Create message attachments table
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

-- Create RLS policy
CREATE POLICY "Users can access attachments in their conversations"
  ON message_attachments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      JOIN cases ON cases.id = c.case_id
      WHERE m.id = message_attachments.message_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON message_attachments(message_id);