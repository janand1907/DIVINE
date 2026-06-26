import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

const schema = z.object({
  vehicle_id: z.string().uuid(),
  pricing_type: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
  base_price: z.coerce.number().min(0),
  included_km: z.coerce.number().int().min(0).optional().nullable(),
  included_hours: z.coerce.number().int().min(0).optional().nullable(),
  extra_per_km: z.coerce.number().min(0).optional().nullable(),
  extra_per_hour: z.coerce.number().min(0).optional().nullable(),
  is_active: z.boolean().optional(),
  display_order: z.coerce.number().int().optional(),
});

export async function GET(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get('vehicle_id');

  const supabase = createAdminClient();
  let query = supabase.from('vehicle_pricing').select('*').order('display_order', { ascending: true });
  if (vehicleId) query = query.eq('vehicle_id', vehicleId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('vehicle_pricing').insert({
    ...parsed.data,
    is_active: parsed.data.is_active ?? true,
    display_order: parsed.data.display_order ?? 0,
    included_km: parsed.data.included_km ?? null,
    included_hours: parsed.data.included_hours ?? null,
    extra_per_km: parsed.data.extra_per_km ?? null,
    extra_per_hour: parsed.data.extra_per_hour ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'create', entity: 'vehicle_pricing', entityId: data.id, metadata: { vehicle_id: data.vehicle_id, label: data.label }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
