-- Create message reactions table
CREATE TABLE IF NOT EXISTS message_reactions_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE message_reactions_v2 ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "message_reactions_access_policy_v3"
  ON message_reactions_v2 FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      JOIN cases ON cases.id = c.case_id
      WHERE m.id = message_reactions_v2.message_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_message_reactions_v2_message ON message_reactions_v2(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_v2_user ON message_reactions_v2(user_id);