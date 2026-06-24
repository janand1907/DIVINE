import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity/log';

const WINDOW_MS = 60_000;
const MAX_PER_IP = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_IP) return false;
  entry.count += 1;
  return true;
}

const mobileRegex = /^(\+?91)?[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    );
  }

  let body: { name?: string; mobile?: string; preferred_time?: string; destination?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const mobile = (body.mobile ?? '').trim();
  if (name.length < 2 || !mobileRegex.test(mobile)) {
    return NextResponse.json(
      { error: 'Name and valid mobile number are required' },
      { status: 422 },
    );
  }

  const landingPage = req.headers.get('referer') ?? null;
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name,
      mobile,
      source: 'callback',
      destination: body.destination ?? null,
      message: body.preferred_time ? `Preferred callback time: ${body.preferred_time}` : null,
      landing_page: landingPage,
      notes: [],
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to request callback' }, { status: 500 });
  }

  await logActivity({
    action: 'create',
    entity: 'lead',
    entityId: data.id,
    metadata: { source: 'callback', name, mobile },
  });

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
