import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { seoPageSchema } from '@/lib/validation/schemas';
import { logActivity } from '@/lib/activity/log';
import type { SeoPageRow } from '@/types/database';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = seoPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    path: parsed.data.path,
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    og_image: parsed.data.og_image || null,
    canonical_path: parsed.data.canonical_path || null,
    robots_index: parsed.data.robots_index,
    json_ld: parsed.data.json_ld ?? null,
  };

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('seo_pages')
    .update(row)
    .eq('id', params.id)
    .select()
    .single<SeoPageRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'seo_page',
    entityId: data.id,
    metadata: { path: data.path },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  const supabase = await createServerClient();
  const { error } = await supabase.from('seo_pages').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'delete',
    entity: 'seo_page',
    entityId: params.id,
    metadata: null,
    userEmail: email,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
