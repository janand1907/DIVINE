import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

export async function GET(request: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entity_type') || '';
  const entityId = searchParams.get('entity_id') || '';

  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'entity_type and entity_id required' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('display_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const body = await request.json();

  if (!body.entity_type || !body.entity_id || !body.section_type) {
    return NextResponse.json({ error: 'entity_type, entity_id, and section_type are required' }, { status: 422 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('page_sections')
    .insert({
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      section_type: body.section_type,
      label: body.label || null,
      config: body.config || {},
      is_enabled: body.is_enabled ?? true,
      display_order: body.display_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'create', entity: 'page_section', entityId: data.id, metadata: { entity_type: data.entity_type, section_type: data.section_type }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
