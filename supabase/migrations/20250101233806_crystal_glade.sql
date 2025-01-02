-- Create message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage reactions in their conversations" ON message_reactions;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create RLS policy
CREATE POLICY "Users can manage reactions in their conversations"
  ON message_reactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      JOIN cases ON cases.id = c.case_id
      WHERE m.id = message_reactions.message_id
      AND (cases.client_id = auth.uid() OR cases.lawyer_id = auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user ON message_reactions(user_id);