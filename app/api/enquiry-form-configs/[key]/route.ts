import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { EnquiryFormConfigRow } from '@/types/database';

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('enquiry_form_configs')
    .select('*')
    .eq('form_key', params.key)
    .eq('is_active', true)
    .maybeSingle<EnquiryFormConfigRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json(null);
  return NextResponse.json(data);
}
