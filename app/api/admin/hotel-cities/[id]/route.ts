import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { HotelCityRow } from '@/types/database';

const hotelCitySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  state: z.string().optional().nullable().or(z.literal('')),
  region: z.string().optional().nullable().or(z.literal('')),
  cover_image: z.string().url().optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable().or(z.literal('')),
  display_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
  seo_title: z.string().optional().nullable().or(z.literal('')),
  seo_description: z.string().optional().nullable().or(z.literal('')),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('hotel_cities')
    .select()
    .eq('id', params.id)
    .single<HotelCityRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = hotelCitySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    state: parsed.data.state === '' ? null : parsed.data.state,
    region: parsed.data.region === '' ? null : parsed.data.region,
    cover_image: parsed.data.cover_image === '' ? null : parsed.data.cover_image,
    description: parsed.data.description === '' ? null : parsed.data.description,
    seo_title: parsed.data.seo_title === '' ? null : parsed.data.seo_title,
    seo_description: parsed.data.seo_description === '' ? null : parsed.data.seo_description,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('hotel_cities')
    .update(row)
    .eq('id', params.id)
    .select()
    .single<HotelCityRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'hotel_city',
    entityId: data.id,
    metadata: { name: data.name, slug: data.slug },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  const supabase = createAdminClient();
  const { error } = await supabase.from('hotel_cities').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'delete',
    entity: 'hotel_city',
    entityId: params.id,
    metadata: null,
    userEmail: email,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
