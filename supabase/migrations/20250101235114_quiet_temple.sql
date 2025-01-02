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
  DROP POLICY IF EXISTS "documents_read_access_v14" ON storage.objects;
  DROP POLICY IF EXISTS "documents_write_access_v14" ON storage.objects;
  DROP POLICY IF EXISTS "documents_update_access_v14" ON storage.objects;
  DROP POLICY IF EXISTS "documents_delete_access_v14" ON storage.objects;

  -- Create new storage policies
  CREATE POLICY "documents_read_access_v15"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'documents');

  CREATE POLICY "documents_write_access_v15"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_update_access_v15"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents')
    WITH CHECK (bucket_id = 'documents');

  CREATE POLICY "documents_delete_access_v15"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents');

  -- Grant permissions
  GRANT SELECT ON storage.objects TO anon;
  GRANT ALL ON storage.objects TO authenticated;
  GRANT ALL ON storage.buckets TO authenticated;
END $$;