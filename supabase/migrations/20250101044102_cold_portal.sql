-- Message Scheduling Tables
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  scheduled_for timestamptz NOT NULL,
  status text CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their scheduled messages"
  ON scheduled_messages FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_user ON scheduled_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON scheduled_messages(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_for ON scheduled_messages(scheduled_for);

-- Function to handle message scheduling
CREATE OR REPLACE FUNCTION handle_scheduled_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update message status when schedule is cancelled
  IF NEW.status = 'cancelled' THEN
    UPDATE messages
    SET status = 'draft'
    WHERE id = NEW.message_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for scheduled message handling
CREATE TRIGGER scheduled_message_trigger
AFTER UPDATE ON scheduled_messages
FOR EACH ROW
EXECUTE FUNCTION handle_scheduled_message();