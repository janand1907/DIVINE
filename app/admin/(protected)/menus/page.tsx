import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin/guard';
import { MenusManager } from '@/components/admin/menus-manager';
import type { NavMenuWithItems, ModuleNavPoolRow } from '@/types/database';

export default async function AdminMenusPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const [{ data: menusData }, { data: poolData }] = await Promise.all([
    supabase
      .from('nav_menus')
      .select('*, nav_items(*)')
      .order('display_order', { ascending: true }),
    supabase
      .from('module_nav_pool')
      .select('*')
      .order('module', { ascending: true })
      .order('label', { ascending: true }),
  ]);

  const menus = ((menusData ?? []) as NavMenuWithItems[]).map((m) => ({
    ...m,
    nav_items: (m.nav_items ?? []).sort((a, b) => a.display_order - b.display_order),
  }));

  const pool = (poolData ?? []) as ModuleNavPoolRow[];

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Navigation Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build your site navigation. Add menus, configure items, and use the pool to link destinations, vehicles, and routes automatically.
        </p>
      </div>
      <MenusManager initial={menus} poolItems={pool} />
    </div>
  );
}
