-- Fix storage configuration
DO $$
BEGIN
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

  -- Drop existing policies safely
  DROP POLICY IF EXISTS "documents_bucket_policy" ON storage.objects;
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "documents_access_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_public_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_policy" ON storage.objects;

  -- Create new policies safely
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'documents_read_access'
  ) THEN
    CREATE POLICY "documents_read_access"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'documents');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'documents_write_access'
  ) THEN
    CREATE POLICY "documents_write_access"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'documents');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'documents_update_access'
  ) THEN
    CREATE POLICY "documents_update_access"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'documents')
      WITH CHECK (bucket_id = 'documents');
  END IF;

  -- Grant permissions
  GRANT SELECT ON storage.objects TO anon;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.buckets TO authenticated;
END $$;