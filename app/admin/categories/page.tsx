import { createServerClient } from '@/lib/supabase/server';
import { CategoriesManager } from '@/components/admin/categories-manager';
import type { PackageCategoryRow } from '@/types/database';

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('package_categories')
    .select()
    .order('display_order', { ascending: true })
    .returns<PackageCategoryRow[]>();

  return <CategoriesManager items={data ?? []} />;
}
