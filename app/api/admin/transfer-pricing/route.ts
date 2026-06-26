import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

const schema = z.object({
  route_id: z.string().uuid(),
  vehicle_type_id: z.string().uuid(),
  base_price: z.coerce.number().min(0),
  return_price: z.coerce.number().min(0).optional().nullable(),
  extra_per_km: z.coerce.number().min(0).optional().nullable(),
  toll_extra: z.coerce.number().min(0).optional().nullable(),
  waiting_charge_per_hour: z.coerce.number().min(0).optional().nullable(),
  night_surcharge: z.coerce.number().min(0).optional().nullable(),
  is_active: z.boolean().optional(),
  display_order: z.coerce.number().int().optional(),
});

export async function GET(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(req.url);
  const routeId = searchParams.get('route_id');

  const supabase = createAdminClient();
  let query = supabase
    .from('transfer_pricing')
    .select('*, transfer_vehicle_types(name, seats)')
    .order('display_order', { ascending: true });
  if (routeId) query = query.eq('route_id', routeId);

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
  const { data, error } = await supabase.from('transfer_pricing').insert({
    ...parsed.data,
    is_active: parsed.data.is_active ?? true,
    display_order: parsed.data.display_order ?? 0,
    return_price: parsed.data.return_price ?? null,
    extra_per_km: parsed.data.extra_per_km ?? null,
    toll_extra: parsed.data.toll_extra ?? null,
    waiting_charge_per_hour: parsed.data.waiting_charge_per_hour ?? null,
    night_surcharge: parsed.data.night_surcharge ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'create', entity: 'transfer_pricing', entityId: data.id, metadata: { route_id: data.route_id }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
