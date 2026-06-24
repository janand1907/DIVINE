import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AdminSession {
  email: string;
  userId: string;
}

/**
 * Server-side admin guard for Server Components under /admin/*.
 * Middleware already redirects unauthenticated requests to /admin/login,
 * so this is a secondary safety check that also returns the session data.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/admin/login');
  }
  return { email: user.email ?? 'unknown', userId: user.id };
}
