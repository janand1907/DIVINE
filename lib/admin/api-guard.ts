import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export interface ApiAdminSession {
  email: string;
  userId: string;
}

/**
 * Route-handler admin guard for /api/admin/*. Unlike `requireAdmin` (which
 * redirects server components), this returns a 401 NextResponse so the caller
 * should short-circuit. On success it yields the authenticated user's email
 * and id for activity logging.
 *
 * Usage:
 *   const session = await requireAdminApi();
 *   if (session instanceof NextResponse) return session;
 */
export async function requireAdminApi(): Promise<ApiAdminSession | NextResponse> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { email: data.user.email ?? 'unknown', userId: data.user.id };
}
