import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import type { PopularRouteCategoryRow } from '@/types/database';

const schema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable().or(z.literal('')),
  display_order: z.coerce.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('popular_route_categories')
    .select('*, popular_routes(*)')
    .order('display_order');
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
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('popular_route_categories')
    .insert({ ...parsed.data, description: parsed.data.description || null })
    .select()
    .single<PopularRouteCategoryRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
