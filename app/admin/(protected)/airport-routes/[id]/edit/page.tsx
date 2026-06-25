import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { AirportRouteForm } from '@/components/admin/airport-route-form';
import type { AirportRouteRow } from '@/types/database';

export default async function EditAirportRoutePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('airport_routes').select().eq('id', params.id).single<AirportRouteRow>();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Edit Route</h2>
        <p className="text-sm text-muted-foreground">{data.from_city} → {data.to_city}</p>
      </div>
      <AirportRouteForm initial={data} />
    </div>
  );
}
