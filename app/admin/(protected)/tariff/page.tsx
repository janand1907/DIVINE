import { createAdminClient } from '@/lib/supabase/server';
import { TariffManager } from '@/components/admin/tariff-manager';
import type { TariffEntryRow } from '@/types/database';

export const metadata = { title: 'Transfer Tariff — Admin' };

export default async function AdminTariffPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('tariff_entries')
    .select()
    .order('display_order');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Transfer Tariff</h2>
        <p className="text-sm text-muted-foreground">Manage vehicle pricing displayed in tariff tables on public pages</p>
      </div>
      <TariffManager initialEntries={(data ?? []) as TariffEntryRow[]} />
    </div>
  );
}
