import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { blogSchema } from '@/lib/validation/schemas';
import { logActivity } from '@/lib/activity/log';
import type { BlogRow } from '@/types/database';

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
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

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    excerpt: parsed.data.excerpt || null,
    cover_image: parsed.data.cover_image || null,
    category: parsed.data.category || null,
    published_at: parsed.data.is_published ? (parsed.data.published_at ?? new Date().toISOString()) : parsed.data.published_at,
    reading_time_minutes: readingMinutes(parsed.data.content),
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    og_image: parsed.data.og_image || null,
    canonical_path: parsed.data.canonical_path || null,
  };

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('blogs')
    .insert(row)
    .select()
    .single<BlogRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'blog',
    entityId: data.id,
    metadata: { slug: data.slug, title: data.title },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 201 });
}
