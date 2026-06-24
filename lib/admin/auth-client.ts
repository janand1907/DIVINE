import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user as User;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
