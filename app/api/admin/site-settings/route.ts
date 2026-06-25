import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { SiteSettingsRow } from '@/types/database';

const siteSettingsSchema = z.object({
  site_url: z.string().url().optional().nullable().or(z.literal('')),
  default_og_image: z.string().url().optional().nullable().or(z.literal('')),
  gtm_id: z.string().max(50).optional().nullable().or(z.literal('')),
  ga4_id: z.string().max(50).optional().nullable().or(z.literal('')),
  meta_pixel_id: z.string().max(50).optional().nullable().or(z.literal('')),
  google_search_console_verification: z.string().max(200).optional().nullable().or(z.literal('')),
  default_social_title: z.string().max(200).optional().nullable().or(z.literal('')),
  default_social_description: z.string().max(500).optional().nullable().or(z.literal('')),
  notifications_email: z.string().email().optional().nullable().or(z.literal('')),
});

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select()
    .eq('id', 1)
    .single<SiteSettingsRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    id: 1 as const,
    site_url: parsed.data.site_url || null,
    default_og_image: parsed.data.default_og_image || null,
    gtm_id: parsed.data.gtm_id || null,
    ga4_id: parsed.data.ga4_id || null,
    meta_pixel_id: parsed.data.meta_pixel_id || null,
    google_search_console_verification: parsed.data.google_search_console_verification || null,
    default_social_title: parsed.data.default_social_title || null,
    default_social_description: parsed.data.default_social_description || null,
    notifications_email: parsed.data.notifications_email || null,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(row)
    .select()
    .single<SiteSettingsRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'site_settings',
    entityId: String(data.id),
    metadata: { site_url: data.site_url, ga4_id: data.ga4_id },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 200 });
}
