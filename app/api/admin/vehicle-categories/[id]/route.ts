import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { upsertNavPool, removeNavPool, vehicleCategoryToNavPool } from '@/lib/nav/pool';
import type { VehicleCategoryRow } from '@/types/database';

const schema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable().or(z.literal('')),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('vehicle_categories').update({ ...parsed.data, description: parsed.data.description || null }).eq('id', params.id).select().single<VehicleCategoryRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await upsertNavPool(vehicleCategoryToNavPool(data));
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('vehicle_categories').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await removeNavPool('vehicle_category', params.id);
  return NextResponse.json({ ok: true });
}
