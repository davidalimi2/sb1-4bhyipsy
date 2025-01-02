import { supabase } from '../lib/supabase';

export async function getSignedUrl(path: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

export async function uploadFile(file: File, path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export function generateStoragePath(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9-]/g, '-');
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '-');
  return `${sanitizedPrefix}/${timestamp}-${sanitizedFilename}`;
}