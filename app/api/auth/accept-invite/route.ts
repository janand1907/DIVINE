import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';

const schema = z.object({
  code: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 422 });

  const supabase = createAdminClient();

  // Validate invite
  const { data: invite } = await supabase
    .from('admin_invites')
    .select('*')
    .eq('code', parsed.data.code)
    .maybeSingle();

  if (!invite) return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  if (invite.used_at) return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
  if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ error: 'Invite expired' }, { status: 400 });

  // Create user via Supabase Admin API
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (createError) return NextResponse.json({ error: createError.message }, { status: 400 });

  // Mark invite as used
  await supabase.from('admin_invites').update({ used_at: new Date().toISOString() }).eq('id', invite.id);

  return NextResponse.json({ user: user.user?.id });
}
