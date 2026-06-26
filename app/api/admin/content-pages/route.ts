import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import type { ContentPageRow } from '@/types/database';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as ContentPageRow[]);
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('content_pages')
    .insert({
      slug: body.slug,
      title: body.title,
      page_type: body.page_type || 'general',
      module: body.module || null,
      entity_id: body.entity_id || null,
      entity_type: body.entity_type || null,
      is_published: body.is_published ?? false,
      display_order: body.display_order ?? 0,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      og_image: body.og_image || null,
      canonical_path: body.canonical_path || null,
      robots_index: body.robots_index ?? true,
      schema_type: body.schema_type || 'WebPage',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
