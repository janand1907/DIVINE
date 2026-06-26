import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin/guard';
import { HotelCitiesManager } from '@/components/admin/hotel-cities-manager';
import type { HotelCityRow } from '@/types/database';

export default async function AdminHotelCitiesPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('hotel_cities')
    .select()
    .order('display_order', { ascending: true })
    .returns<HotelCityRow[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Hotel Cities</h1>
        <p className="mt-1 text-muted-foreground">Manage hotel destinations and cities</p>
      </div>
      <HotelCitiesManager items={data ?? []} />
    </div>
  );
}
