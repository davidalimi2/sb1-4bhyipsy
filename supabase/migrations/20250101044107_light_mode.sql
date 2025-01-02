-- Message Drafts Table
CREATE TABLE IF NOT EXISTS message_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  recipient_id uuid REFERENCES users(id),
  subject text,
  content text,
  parent_id uuid REFERENCES messages(id),
  folder_id uuid REFERENCES message_folders(id),
  attachments uuid[] DEFAULT '{}',
  last_edited timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE message_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their drafts"
  ON message_drafts FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_message_drafts_user ON message_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_message_drafts_last_edited ON message_drafts(last_edited);

-- Function to auto-save drafts
CREATE OR REPLACE FUNCTION auto_save_draft()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_edited = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-saving drafts
CREATE TRIGGER message_draft_auto_save
BEFORE UPDATE ON message_drafts
FOR EACH ROW
EXECUTE FUNCTION auto_save_draft();