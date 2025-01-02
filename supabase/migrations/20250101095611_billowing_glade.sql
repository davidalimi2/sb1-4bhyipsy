-- Set up storage bucket with proper configuration
DO $$
BEGIN
  -- Create bucket with proper limits and MIME types
  INSERT INTO storage.buckets (
    id, 
    name, 
    public, 
    file_size_limit, 
    allowed_mime_types
  )
  VALUES (
    'documents',
    'documents',
    true, -- Make bucket public for easier access
    52428800, -- 50MB limit
    ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ]
  )
  ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

  -- Ensure bucket is public
  UPDATE storage.buckets
    SET public = true
    WHERE id = 'documents';
END $$;