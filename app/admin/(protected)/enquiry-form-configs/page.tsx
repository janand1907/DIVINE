import { createAdminClient } from '@/lib/supabase/server';
import { EnquiryFormConfigsManager } from '@/components/admin/enquiry-form-configs-manager';
import { requireAdmin } from '@/lib/admin/guard';
import type { EnquiryFormConfigRow } from '@/types/database';

export default async function AdminEnquiryFormConfigsPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('enquiry_form_configs')
    .select()
    .order('display_order', { ascending: true })
    .order('form_key', { ascending: true })
    .returns<EnquiryFormConfigRow[]>();

  return <EnquiryFormConfigsManager items={data ?? []} />;
}
