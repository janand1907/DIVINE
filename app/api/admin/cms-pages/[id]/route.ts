import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { CmsPageRow } from '@/types/database';

const schema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(200),
  page_type: z.enum(['tour', 'vehicle', 'transfer', 'general', 'seo']).default('general'),
  hero_heading: z.string().max(300).optional().nullable().or(z.literal('')),
  hero_subheading: z.string().max(500).optional().nullable().or(z.literal('')),
  hero_image: z.string().url().optional().nullable().or(z.literal('')),
  content: z.string().default(''),
  gallery: z.array(z.string()).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  cta_text: z.string().max(100).optional().nullable().or(z.literal('')),
  cta_url: z.string().max(500).optional().nullable().or(z.literal('')),
  seo_title: z.string().max(200).optional().nullable().or(z.literal('')),
  seo_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
  canonical_path: z.string().max(500).optional().nullable().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('cms_pages').select().eq('id', params.id).single<CmsPageRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const row = { ...parsed.data, hero_heading: parsed.data.hero_heading || null, hero_subheading: parsed.data.hero_subheading || null, hero_image: parsed.data.hero_image || null, cta_text: parsed.data.cta_text || null, cta_url: parsed.data.cta_url || null, seo_title: parsed.data.seo_title || null, seo_description: parsed.data.seo_description || null, og_image: parsed.data.og_image || null, canonical_path: parsed.data.canonical_path || null };

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('cms_pages').update(row).eq('id', params.id).select().single<CmsPageRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'update', entity: 'cms_page', entityId: data.id, metadata: { slug: data.slug }, userEmail: session.email });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('cms_pages').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'delete', entity: 'cms_page', entityId: params.id, metadata: null, userEmail: session.email });
  return NextResponse.json({ ok: true });
}
