import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { NavMenuRow } from '@/types/database';

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('nav_menus')
    .select('*, nav_items(*)')
    .order('display_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: {
    title?: string;
    url?: string;
    icon?: string | null;
    pool_entity_id?: string | null;
    open_in_new_tab?: boolean;
    display_order?: number;
    is_active?: boolean;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.title?.trim()) return NextResponse.json({ error: 'title is required' }, { status: 422 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('nav_menus')
    .insert({
      title: body.title.trim(),
      url: body.url || '/',
      icon: body.icon ?? null,
      pool_entity_id: body.pool_entity_id ?? null,
      open_in_new_tab: body.open_in_new_tab ?? false,
      display_order: body.display_order ?? 0,
      is_active: body.is_active ?? true,
    })
    .select()
    .single<NavMenuRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'create', entity: 'nav_menu', entityId: data.id, metadata: { title: data.title }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
