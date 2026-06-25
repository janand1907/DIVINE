import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { DestinationRow } from '@/types/database';

const destinationSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  region: z.enum(['divine', 'domestic', 'international']).default('domestic'),
  description: z.string().max(2000).optional().nullable().or(z.literal('')),
  cover_image: z.string().url().optional().nullable().or(z.literal('')),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.boolean().default(false),
});

export async function PUT(
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

  const parsed = destinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    description: parsed.data.description || null,
    cover_image: parsed.data.cover_image || null,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('destinations')
    .update(row)
    .eq('id', params.id)
    .select()
    .single<DestinationRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'destination',
    entityId: data.id,
    metadata: { name: data.name },
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
  const { error } = await supabase.from('destinations').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'delete',
    entity: 'destination',
    entityId: params.id,
    metadata: null,
    userEmail: email,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
