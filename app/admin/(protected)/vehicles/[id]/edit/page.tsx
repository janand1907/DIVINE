import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { VehicleForm } from '@/components/admin/vehicle-form';
import type { VehicleRow, VehicleCategoryRow } from '@/types/database';

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const [{ data: vehicle }, { data: categories }] = await Promise.all([
    supabase.from('vehicles').select().eq('id', params.id).single<VehicleRow>(),
    supabase.from('vehicle_categories').select().order('display_order').returns<VehicleCategoryRow[]>(),
  ]);

  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Edit Vehicle</h2>
        <p className="text-sm text-muted-foreground">{vehicle.name}</p>
      </div>
      <VehicleForm initial={vehicle} categories={categories ?? []} />
    </div>
  );
}
