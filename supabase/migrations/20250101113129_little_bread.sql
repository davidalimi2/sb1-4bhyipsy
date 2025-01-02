-- Fix storage configuration
DO $$
BEGIN
  -- Drop all existing storage policies first
  DROP POLICY IF EXISTS "documents_bucket_policy" ON storage.objects;
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "documents_access_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_public_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_write_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_update_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_public_read_v1" ON storage.objects;
  DROP POLICY IF EXISTS "documents_auth_write_v1" ON storage.objects;
  DROP POLICY IF EXISTS "documents_auth_update_v1" ON storage.objects;
  DROP POLICY IF EXISTS "documents_auth_delete_v1" ON storage.objects;

  -- Update bucket configuration
  UPDATE storage.buckets
  SET 
    public = true,
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

  -- Create new storage policies with unique names
  CREATE POLICY "documents_read_access_v4"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'documents');

  CREATE POLICY "documents_write_access_v4"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_update_access_v4"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents')
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_delete_access_v4"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents');

  -- Grant permissions
  GRANT SELECT ON storage.objects TO anon;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.buckets TO authenticated;
END $$;