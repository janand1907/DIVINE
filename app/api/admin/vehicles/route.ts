import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { VehicleRow } from '@/types/database';

const schema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(200),
  category_id: z.string().uuid().optional().nullable().or(z.literal('')),
  seats: z.coerce.number().int().min(1).max(100).default(4),
  luggage_capacity: z.coerce.number().int().min(0).max(50).default(2),
  price_per_km: z.coerce.number().min(0).optional().nullable(),
  price_per_day: z.coerce.number().min(0).optional().nullable(),
  starting_price: z.coerce.number().min(0).optional().nullable(),
  images: z.array(z.string()).default([]),
  cover_image: z.string().url().optional().nullable().or(z.literal('')),
  description: z.string().default(''),
  features: z.array(z.string()).default([]),
  is_ac: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  seo_title: z.string().max(200).optional().nullable().or(z.literal('')),
  seo_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
});

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('vehicles')
    .select('id,slug,name,category_id,seats,starting_price,is_published,is_featured,updated_at')
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const row = { ...parsed.data, category_id: parsed.data.category_id || null, cover_image: parsed.data.cover_image || null, price_per_km: parsed.data.price_per_km ?? null, price_per_day: parsed.data.price_per_day ?? null, starting_price: parsed.data.starting_price ?? null, seo_title: parsed.data.seo_title || null, seo_description: parsed.data.seo_description || null, og_image: parsed.data.og_image || null };

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('vehicles').insert(row).select().single<VehicleRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'create', entity: 'vehicle', entityId: data.id, metadata: { slug: data.slug, name: data.name }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
