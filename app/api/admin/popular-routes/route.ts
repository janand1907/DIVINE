import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import type { PopularRouteRow } from '@/types/database';

const schema = z.object({
  category_id: z.string().uuid(),
  label: z.string().min(1).max(200),
  url: z.string().min(1).max(500),
  display_order: z.coerce.number().int().default(0),
});

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
  const { data, error } = await supabase.from('popular_routes').insert(parsed.data).select().single<PopularRouteRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
