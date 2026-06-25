import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { MediaAssetRow } from '@/types/database';

export async function GET() {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('media_assets')
    .select()
    .order('created_at', { ascending: false })
    .returns<MediaAssetRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: {
    url?: string;
    filename?: string;
    alt_text?: string;
    tags?: string[];
    mime_type?: string | null;
    size_bytes?: number | null;
    width?: number | null;
    height?: number | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.url || typeof body.url !== 'string' || !/^https?:\/\//.test(body.url)) {
    return NextResponse.json(
      { error: 'Validation failed', issues: { url: ['A valid http(s) URL is required'] } },
      { status: 422 },
    );
  }

  const filename =
    body.filename?.trim() || body.url.split('/').pop()?.split('?')[0] || 'untitled';

  const row = {
    filename,
    url: body.url,
    alt_text: body.alt_text ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    mime_type: body.mime_type ?? guessMime(filename),
    size_bytes: body.size_bytes ?? null,
    width: body.width ?? null,
    height: body.height ?? null,
    is_published: true,
    uploaded_by: email,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('media_assets')
    .insert(row)
    .select()
    .single<MediaAssetRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'media_asset',
    entityId: data.id,
    metadata: { filename: data.filename },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 201 });
}

function guessMime(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    avif: 'image/avif',
  };
  return map[ext] ?? 'image/jpeg';
}
