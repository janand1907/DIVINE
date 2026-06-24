import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { testimonialSchema } from '@/lib/validation/schemas';
import { logActivity } from '@/lib/activity/log';
import type { TestimonialRow } from '@/types/database';

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

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    author_location: parsed.data.author_location || null,
    avatar_url: parsed.data.avatar_url || null,
    tour_taken: parsed.data.tour_taken || null,
    rating: Number(parsed.data.rating),
  };

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('testimonials')
    .insert(row)
    .select()
    .single<TestimonialRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'testimonial',
    entityId: data.id,
    metadata: { author: data.author_name, rating: data.rating },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 201 });
}
