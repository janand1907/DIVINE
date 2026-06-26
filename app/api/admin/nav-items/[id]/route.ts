import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { NavItemRow } from '@/types/database';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: {
    title?: string;
    url?: string;
    description?: string | null;
    icon?: string | null;
    badge_text?: string | null;
    pool_entity_id?: string | null;
    open_in_new_tab?: boolean;
    display_order?: number;
    is_active?: boolean;
  };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('nav_items')
    .update({
      title: body.title,
      url: body.url,
      description: body.description,
      icon: body.icon,
      badge_text: body.badge_text,
      pool_entity_id: body.pool_entity_id,
      open_in_new_tab: body.open_in_new_tab,
      display_order: body.display_order,
      is_active: body.is_active,
    })
    .eq('id', params.id)
    .select()
    .single<NavItemRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity({ action: 'update', entity: 'nav_item', entityId: data.id, metadata: { title: data.title }, userEmail: session.email });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('nav_items').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'delete', entity: 'nav_item', entityId: params.id, metadata: null, userEmail: session.email });
  return NextResponse.json({ ok: true });
}
