import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { packageSchema } from '@/lib/validation/schemas';
import { logActivity } from '@/lib/activity/log';
import type { PackageRow } from '@/types/database';

export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Normalize empty optional URL/string fields to null for JSONB cleanliness.
  const row = {
    ...parsed.data,
    subtitle: parsed.data.subtitle || null,
    category_id: parsed.data.category_id || null,
    destination_id: parsed.data.destination_id || null,
    starting_price: parsed.data.starting_price ?? null,
    cover_image: parsed.data.cover_image || null,
    seo_title: parsed.data.seo_title || null,
    seo_description: parsed.data.seo_description || null,
    og_image: parsed.data.og_image || null,
    canonical_path: parsed.data.canonical_path || null,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('packages')
    .insert(row)
    .select()
    .single<PackageRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'package',
    entityId: data.id,
    metadata: { slug: data.slug, title: data.title },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 201 });
}
