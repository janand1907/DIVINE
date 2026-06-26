import { NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/server';
import type { HotelCityRow } from '@/types/database';

export async function GET() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('hotel_cities')
    .select()
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .returns<HotelCityRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
