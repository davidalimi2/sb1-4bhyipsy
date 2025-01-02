-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create documents bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('documents', 'documents', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policy for authenticated users
CREATE POLICY "authenticated_user_access"
ON storage.objects
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  bucket_id = 'documents'
);