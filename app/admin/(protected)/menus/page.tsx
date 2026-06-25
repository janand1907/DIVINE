import { createAdminClient } from '@/lib/supabase/server';
import { MenusManager } from '@/components/admin/menus-manager';
import type { NavMenuWithItems } from '@/types/database';

export default async function AdminMenusPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('nav_menus')
    .select('*, nav_items(*)')
    .order('display_order', { ascending: true });

  const menus = ((data ?? []) as NavMenuWithItems[]).map((m) => ({
    ...m,
    nav_items: (m.nav_items ?? []).sort((a, b) => a.display_order - b.display_order),
  }));

  return <MenusManager initial={menus} />;
}
