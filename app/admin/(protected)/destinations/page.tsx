import { createAdminClient } from '@/lib/supabase/server';
import { DestinationsManager } from '@/components/admin/destinations-manager';
import type { DestinationRow } from '@/types/database';

export default async function AdminDestinationsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('destinations')
    .select()
    .order('display_order', { ascending: true })
    .returns<DestinationRow[]>();

  return <DestinationsManager items={data ?? []} />;
}
