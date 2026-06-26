import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

const patchSchema = z.object({
  is_enabled: z.boolean().optional(),
  display_order: z.number().int().optional(),
  config: z.record(z.unknown()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('homepage_sections')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    action: 'update',
    entity: 'homepage_section',
    entityId: params.id,
    metadata: { fields: Object.keys(parsed.data) },
    userEmail: session.email,
  });

  return NextResponse.json(data);
}
