-- Fix storage configuration
DO $$
BEGIN
  -- Update bucket configuration
  UPDATE storage.buckets
  SET 
    public = true, -- Make public for easier access
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ]
  WHERE id = 'documents';

  -- Drop existing policies
  DROP POLICY IF EXISTS "documents_bucket_policy" ON storage.objects;
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "documents_access_policy" ON storage.objects;

  -- Create public access policy
  CREATE POLICY "documents_public_access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'documents');

  -- Create authenticated user policy for modifications
  CREATE POLICY "documents_authenticated_access"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

  -- Grant permissions
  GRANT SELECT ON storage.objects TO anon;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.buckets TO authenticated;
END $$;