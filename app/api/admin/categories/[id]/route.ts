import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { PackageCategoryRow } from '@/types/database';

const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().nullable().or(z.literal('')),
  parent_id: z.string().uuid().optional().nullable(),
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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    description: parsed.data.description || null,
    parent_id: parsed.data.parent_id || null,
  };

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('package_categories')
    .update(row)
    .eq('id', params.id)
    .select()
    .single<PackageCategoryRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'package_category',
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

  const supabase = await createServerClient();
  const { error } = await supabase
    .from('package_categories')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'delete',
    entity: 'package_category',
    entityId: params.id,
    metadata: null,
    userEmail: email,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
