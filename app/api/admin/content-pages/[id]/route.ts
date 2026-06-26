import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

interface RouteParams { params: { id: string } }

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const allowed = [
    'title', 'slug', 'page_type', 'module', 'entity_id', 'entity_type',
    'is_published', 'display_order', 'seo_title', 'seo_description',
    'og_image', 'canonical_path', 'robots_index', 'schema_type',
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('content_pages')
    .update(update)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'update', entity: 'content_page', entityId: params.id, metadata: { fields: Object.keys(update) }, userEmail: session.email });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();

  await supabase.from('page_sections').delete().eq('entity_type', 'content_page').eq('entity_id', params.id);

  const { error } = await supabase
    .from('content_pages')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'delete', entity: 'content_page', entityId: params.id, userEmail: session.email });
  return NextResponse.json({ success: true });
}
