import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/server';
import { leadSchema } from '@/lib/validation/schemas';

const WINDOW_MS = 60_000;
const MAX_PER_IP = 5;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_IP) return false;
  entry.count += 1;
  return true;
}

function parseUtmCookies(cookieHeader: string | null) {
  const cookies = Object.fromEntries(
    (cookieHeader ?? '')
      .split(';')
      .map((c) => c.trim().split('='))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k, decodeURIComponent(v)]),
  );
  return {
    utm_source: cookies.utm_source ?? null,
    utm_medium: cookies.utm_medium ?? null,
    utm_campaign: cookies.utm_campaign ?? null,
    utm_term: cookies.utm_term ?? null,
    utm_content: cookies.utm_content ?? null,
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const utm = parseUtmCookies(req.headers.get('cookie'));
  const landingPage = req.headers.get('referer') ?? null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...parsed.data,
      email: parsed.data.email || null,
      destination: parsed.data.destination || null,
      travel_date: parsed.data.travel_date || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message || null,
      package_id: parsed.data.package_id || null,
      package_slug: parsed.data.package_slug || null,
      ...utm,
      landing_page: landingPage,
      notes: [],
    })
    .select('id, name, mobile, destination')
    .single();

  if (error) {
    console.error('[/api/leads] Supabase insert error:', error.message, error.code, error.details);
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, id: data.id, message: 'Lead submitted successfully' },
    { status: 201 },
  );
}
