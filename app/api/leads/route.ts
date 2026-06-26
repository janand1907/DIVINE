import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { leadSchema } from '@/lib/validation/schemas';
import { rateLimit, getClientIp } from '@/lib/rate-limit';


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
  const ip = getClientIp(req);
  const limiter = rateLimit(`leads:${ip}`, { windowMs: 60_000, max: 5 });
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((limiter.resetAt - Date.now()) / 1000)) } },
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

  const supabase = createAdminClient();

  const insertPayload = {
    name: parsed.data.name,
    mobile: parsed.data.mobile,
    email: parsed.data.email || null,
    destination: parsed.data.destination || null,
    travel_date: parsed.data.travel_date || null,
    adults: parsed.data.adults ?? null,
    children: parsed.data.children ?? null,
    budget: parsed.data.budget || null,
    message: parsed.data.message || null,
    source: parsed.data.source,
    package_id: parsed.data.package_id || null,
    package_slug: parsed.data.package_slug || null,
    ...utm,
    landing_page: landingPage,
    notes: [],
  };

  const { data, error } = await supabase
    .from('leads')
    .insert(insertPayload)
    .select('id, name, mobile, destination')
    .single();

  if (error) {
    console.error('[/api/leads] Supabase insert error:', error.message, error.code, error.details);
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.', detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, id: data.id, message: 'Lead submitted successfully' },
    { status: 201 },
  );
}
