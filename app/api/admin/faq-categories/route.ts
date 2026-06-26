import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';

const schema = z.object({
  name: z.string().min(1).max(100),
  display_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('faq_categories')
    .select('*')
    .order('display_order', { ascending: true });
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
  const { data, error } = await supabase.from('faq_categories').insert({ ...parsed.data, is_published: parsed.data.is_published ?? true, display_order: parsed.data.display_order ?? 0 }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await logActivity({ action: 'create', entity: 'faq_category', entityId: data.id, metadata: { name: data.name }, userEmail: session.email });
  return NextResponse.json(data, { status: 201 });
}
