import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ valid: false });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('admin_invites')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (!data) return NextResponse.json({ valid: false });
  if (data.used_at) return NextResponse.json({ valid: false, used: true });
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ valid: false });

  return NextResponse.json({ valid: true, email_hint: data.email_hint });
}
