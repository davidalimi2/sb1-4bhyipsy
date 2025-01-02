-- Message Rules Table
CREATE TABLE IF NOT EXISTS message_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  active boolean DEFAULT true,
  conditions jsonb NOT NULL DEFAULT '[]',
  actions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE message_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their rules"
  ON message_rules FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_message_rules_user ON message_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_message_rules_active ON message_rules(active);

-- Function to process rules for new messages
CREATE OR REPLACE FUNCTION process_message_rules()
RETURNS TRIGGER AS $$
BEGIN
  -- Get applicable rules for the recipient
  WITH applicable_rules AS (
    SELECT r.* 
    FROM message_rules r
    WHERE r.user_id = NEW.recipient_id
    AND r.active = true
  )
  UPDATE messages m
  SET 
    folder_id = COALESCE(
      (SELECT value::uuid 
       FROM applicable_rules ar, 
            jsonb_array_elements(ar.actions) a 
       WHERE a->>'type' = 'move_to' 
       LIMIT 1),
      m.folder_id
    ),
    read = COALESCE(
      (SELECT 
        CASE WHEN a->>'value' = 'read' THEN true
             WHEN a->>'value' = 'unread' THEN false
             ELSE m.read
        END
       FROM applicable_rules ar,
            jsonb_array_elements(ar.actions) a
       WHERE a->>'type' = 'mark_as'
       LIMIT 1),
      m.read
    )
  WHERE m.id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rule processing
CREATE TRIGGER message_rules_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION process_message_rules();