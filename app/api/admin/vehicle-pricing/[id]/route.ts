import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

const patchSchema = z.object({
  pricing_type: z.string().min(1).max(50).optional(),
  label: z.string().min(1).max(200).optional(),
  base_price: z.coerce.number().min(0).optional(),
  included_km: z.coerce.number().int().min(0).optional().nullable(),
  included_hours: z.coerce.number().int().min(0).optional().nullable(),
  extra_per_km: z.coerce.number().min(0).optional().nullable(),
  extra_per_hour: z.coerce.number().min(0).optional().nullable(),
  is_active: z.boolean().optional(),
  display_order: z.coerce.number().int().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('vehicle_pricing').update(parsed.data).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity({ action: 'update', entity: 'vehicle_pricing', entityId: params.id, metadata: { fields: Object.keys(parsed.data) }, userEmail: session.email });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('vehicle_pricing').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity({ action: 'delete', entity: 'vehicle_pricing', entityId: params.id, metadata: {}, userEmail: session.email });
  return new NextResponse(null, { status: 204 });
}
