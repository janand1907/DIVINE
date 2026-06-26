import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';

interface RouteParams { params: { id: string } }

export async function GET(_request: Request, { params }: RouteParams) {
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

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('content_pages')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
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
  return NextResponse.json({ success: true });
}
