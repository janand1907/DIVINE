import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import type { TariffEntryRow } from '@/types/database';

const schema = z.object({
  vehicle: z.string().min(1).max(100),
  seats: z.coerce.number().int().positive().optional().nullable(),
  price_4h_40km: z.coerce.number().min(0).optional().nullable(),
  price_8h_80km: z.coerce.number().min(0).optional().nullable(),
  extra_per_km: z.coerce.number().min(0).optional().nullable(),
  extra_per_hour: z.coerce.number().min(0).optional().nullable(),
  outstation_price: z.coerce.number().min(0).optional().nullable(),
  driver_bata: z.coerce.number().min(0).optional().nullable(),
  display_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
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
  const { data, error } = await supabase
    .from('tariff_entries')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single<TariffEntryRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const supabase = createAdminClient();
  const { error } = await supabase.from('tariff_entries').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
