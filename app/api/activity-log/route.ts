import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { action?: string; entity?: string; entityId?: string | null; metadata?: Record<string, unknown> | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const h = headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const userAgent = h.get('user-agent') ?? null;

  const { error: insertError } = await supabase.from('activity_logs').insert({
    user_email: userData.user.email,
    action: body.action ?? 'unknown',
    entity: body.entity ?? 'unknown',
    entity_id: body.entityId ?? null,
    metadata: body.metadata ?? null,
    ip,
    user_agent: userAgent,
  });

  if (insertError) {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
