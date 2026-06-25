import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { NavItemRow } from '@/types/database';

export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: { menu_id?: string; parent_id?: string | null; title?: string; url?: string; description?: string | null; display_order?: number; is_active?: boolean };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.menu_id || !body.title?.trim() || !body.url?.trim()) {
    return NextResponse.json({ error: 'menu_id, title, and url are required' }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('nav_items')
    .insert({ menu_id: body.menu_id, parent_id: body.parent_id || null, title: body.title.trim(), url: body.url.trim(), description: body.description || null, display_order: body.display_order ?? 0, is_active: body.is_active ?? true })
    .select()
    .single<NavItemRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity({ action: 'create', entity: 'nav_item', entityId: data.id, metadata: { title: data.title }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
