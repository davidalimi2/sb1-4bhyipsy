-- Fix storage configuration
DO $$
BEGIN
  -- Create documents bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name)
  VALUES ('documents', 'documents')
  ON CONFLICT (id) DO NOTHING;

  -- Update bucket configuration
  UPDATE storage.buckets
  SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ]
  WHERE id = 'documents';

  -- Drop ALL existing policies to ensure clean slate
  DROP POLICY IF EXISTS "documents_bucket_policy" ON storage.objects;
  DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;
  DROP POLICY IF EXISTS "documents_access_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_public_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_policy" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_write_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_update_access" ON storage.objects;
  DROP POLICY IF EXISTS "documents_read_access_v12" ON storage.objects;
  DROP POLICY IF EXISTS "documents_write_access_v12" ON storage.objects;
  DROP POLICY IF EXISTS "documents_update_access_v12" ON storage.objects;
  DROP POLICY IF EXISTS "documents_delete_access_v12" ON storage.objects;

  -- Create new storage policies with version 13
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'documents_read_access_v13'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "documents_read_access_v13"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'documents');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'documents_write_access_v13'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "documents_write_access_v13"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'documents');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'documents_update_access_v13'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "documents_update_access_v13"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'documents')
      WITH CHECK (bucket_id = 'documents');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'documents_delete_access_v13'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "documents_delete_access_v13"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'documents');
  END IF;

  -- Grant permissions
  GRANT SELECT ON storage.objects TO anon;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.buckets TO authenticated;
END $$;