import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type AnyClient = SupabaseClient<any>;

/**
 * Public (anon-key only) client — never touches cookies. Safe to call from
 * generateMetadata, sitemap.ts, generateStaticParams, or any code that runs
 * outside a live request context. Sees only RLS-permitted public rows.
 */
export function createPublicClient(): AnyClient {
  return createSupabaseClient<Database>(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }) as unknown as AnyClient;
}

/**
 * Per-request client for Server Components, Route Handlers, and Server Actions.
 * Uses @supabase/ssr to read/write the auth session cookie so the browser
 * client (createBrowserClient) and this server client share the same session.
 *
 * MUST NOT be called from generateMetadata or static-generation paths.
 * Use createPublicClient() for those.
 */
export async function createServerClient(): Promise<AnyClient> {
  const cookieStore = cookies();
  return createSupabaseServerClient<Database>(URL, ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components can't set cookies — middleware handles the refresh.
        }
      },
    },
  }) as unknown as AnyClient;
}
