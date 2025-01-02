import { supabase } from './supabase';

export async function fetchCases() {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      client:client_id(full_name),
      lawyer:lawyer_id(full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchDocuments(caseId?: string) {
  let query = supabase
    .from('documents')
    .select(`
      *,
      created_by(full_name),
      comments(count)
    `)
    .order('created_at', { ascending: false });

  if (caseId && caseId !== 'all') {
    query = query.eq('case_id', caseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      case:case_id(title)
    `)
    .eq('status', 'pending')
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data;
}