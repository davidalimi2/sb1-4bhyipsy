-- Add thread_id column to messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'thread_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN thread_id uuid REFERENCES messages(id);
    CREATE INDEX idx_messages_thread ON messages(thread_id);
  END IF;
END $$;

-- Add parent_id column to messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN parent_id uuid REFERENCES messages(id);
    CREATE INDEX idx_messages_parent ON messages(parent_id);
  END IF;
END $$;

-- Function to update thread_id when replying
CREATE OR REPLACE FUNCTION update_message_thread()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a reply, set thread_id to the root message
  IF NEW.parent_id IS NOT NULL THEN
    NEW.thread_id := COALESCE(
      (SELECT thread_id FROM messages WHERE id = NEW.parent_id),
      NEW.parent_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for thread updates if it doesn't exist
DO $$ 
BEGIN
  CREATE TRIGGER message_thread_trigger
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_thread();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;