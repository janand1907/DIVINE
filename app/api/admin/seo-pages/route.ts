import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { seoPageSchema } from '@/lib/validation/schemas';
import { logActivity } from '@/lib/activity/log';
import type { SeoPageRow } from '@/types/database';

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('seo_pages')
    .select()
    .order('path', { ascending: true })
    .returns<SeoPageRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
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
    .insert(row)
    .select()
    .single<SeoPageRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'seo_page',
    entityId: data.id,
    metadata: { path: data.path },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 201 });
}
