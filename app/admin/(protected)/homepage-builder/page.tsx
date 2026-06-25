import { createAdminClient } from '@/lib/supabase/server';
import { HomepageBuilderClient } from '@/components/admin/homepage-builder-client';
import type { HomepageSection } from '@/types/database';

export default async function AdminHomepageBuilderPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('display_order', { ascending: true })
    .returns<HomepageSection[]>();

  return <HomepageBuilderClient sections={data ?? []} />;
}
