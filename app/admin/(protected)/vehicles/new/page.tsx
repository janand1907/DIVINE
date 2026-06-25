import { createAdminClient } from '@/lib/supabase/server';
import { VehicleForm } from '@/components/admin/vehicle-form';
import type { VehicleCategoryRow } from '@/types/database';

export default async function NewVehiclePage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('vehicle_categories').select().order('display_order').returns<VehicleCategoryRow[]>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">New Vehicle</h2>
        <p className="text-sm text-muted-foreground">Add a vehicle to the rental fleet</p>
      </div>
      <VehicleForm categories={data ?? []} />
    </div>
  );
}
