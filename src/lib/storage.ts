import { supabase } from './supabase';

export async function initializeStorage() {
  try {
    // Verify we can list files (tests access)
    const { error: listError } = await supabase.storage
      .from('documents')
      .list('');

    if (listError && !listError.message.includes('No files found')) {
      console.error('Error accessing documents bucket:', listError);
      return;
    }

    console.log('Storage initialized successfully');
  } catch (error) {
    // Log error but don't crash the app
    console.error('Storage initialization error:', error);
  }
}