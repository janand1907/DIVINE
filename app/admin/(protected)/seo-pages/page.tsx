import { createServerClient } from '@/lib/supabase/server';
import { SeoPagesManager } from '@/components/admin/seo-pages-manager';
import type { SeoPageRow } from '@/types/database';

export default async function AdminSeoPagesPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('seo_pages')
    .select()
    .order('path', { ascending: true })
    .returns<SeoPageRow[]>();

  return <SeoPagesManager items={data ?? []} />;
}
