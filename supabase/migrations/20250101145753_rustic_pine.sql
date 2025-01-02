-- Add parent_id column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES messages(id);

-- Add index for parent_id
CREATE INDEX IF NOT EXISTS idx_messages_parent ON messages(parent_id);

-- Add thread_id column to track root message of thread
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS thread_id uuid REFERENCES messages(id);

-- Add index for thread_id
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);

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

-- Create trigger for thread updates
CREATE TRIGGER message_thread_trigger
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_message_thread();