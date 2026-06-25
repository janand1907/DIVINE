import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { AirportRouteRow } from '@/types/database';

const vehicleSchema = z.object({
  vehicle_type: z.string().min(1),
  seats: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
});

const schema = z.object({
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  from_city: z.string().min(2).max(100),
  to_city: z.string().min(2).max(100),
  distance_km: z.coerce.number().int().min(0).optional().nullable(),
  duration_hours: z.coerce.number().min(0).optional().nullable(),
  vehicles: z.array(vehicleSchema).default([]),
  description: z.string().max(2000).optional().nullable().or(z.literal('')),
  is_active: z.boolean().default(true),
  seo_title: z.string().max(200).optional().nullable().or(z.literal('')),
  seo_description: z.string().max(500).optional().nullable().or(z.literal('')),
  og_image: z.string().url().optional().nullable().or(z.literal('')),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('airport_routes').select().eq('id', params.id).single<AirportRouteRow>();
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

  const row = { ...parsed.data, distance_km: parsed.data.distance_km ?? null, duration_hours: parsed.data.duration_hours ?? null, description: parsed.data.description || null, seo_title: parsed.data.seo_title || null, seo_description: parsed.data.seo_description || null, og_image: parsed.data.og_image || null };

  const supabase = createAdminClient();
  const { data, error } = await supabase.from('airport_routes').update(row).eq('id', params.id).select().single<AirportRouteRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'update', entity: 'airport_route', entityId: data.id, metadata: { slug: data.slug }, userEmail: session.email });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('airport_routes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ action: 'delete', entity: 'airport_route', entityId: params.id, metadata: null, userEmail: session.email });
  return NextResponse.json({ ok: true });
}
