import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

export interface LogActivityArgs {
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'status_change'
    | 'publish'
    | 'unpublish'
    | 'login'
    | 'logout';
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  userEmail?: string | null;
}

/**
 * Insert a row in `activity_logs`. Falls through silently if it fails —
 * must never block the parent action.
 */
export async function logActivity(args: LogActivityArgs): Promise<void> {
  try {
    const supabase = await createServerClient();
    const h = headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const userAgent = h.get('user-agent') ?? null;

    await supabase.from('activity_logs').insert({
      action: args.action,
      entity: args.entity,
      entity_id: args.entityId ?? null,
      metadata: args.metadata ?? null,
      user_email: args.userEmail ?? null,
      ip,
      user_agent: userAgent,
    });
  } catch {
    // Never let audit logging fail the user's operation.
  }
}
