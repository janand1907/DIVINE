import { createPublicClient } from '@/lib/supabase/server';
import type { NavMenuWithItems, ModuleNavPoolRow } from '@/types/database';

export async function fetchNavMenus(): Promise<NavMenuWithItems[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('nav_menus')
      .select('*, nav_items(*)')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!data) return [];

    return (data as NavMenuWithItems[]).map((menu) => ({
      ...menu,
      nav_items: (menu.nav_items ?? [])
        .filter((item) => item.is_active)
        .sort((a, b) => a.display_order - b.display_order),
    }));
  } catch {
    return [];
  }
}

export interface PoolItem {
  module: string;
  label: string;
  url: string;
  cover_image: string | null;
  badge_text: string | null;
}

export async function fetchNavPool(module?: string): Promise<PoolItem[]> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('module_nav_pool')
      .select('module,label,url,cover_image,badge_text')
      .eq('is_published', true)
      .order('label', { ascending: true });

    if (module) {
      query = query.eq('module', module);
    }

    const { data } = await query;
    return (data ?? []) as PoolItem[];
  } catch {
    return [];
  }
}

export async function fetchNavWithPool(): Promise<{
  menus: NavMenuWithItems[];
  pool: Record<string, PoolItem[]>;
}> {
  const [menus, allPool] = await Promise.all([
    fetchNavMenus(),
    fetchNavPool(),
  ]);

  const pool: Record<string, PoolItem[]> = {};
  for (const item of allPool) {
    if (!pool[item.module]) pool[item.module] = [];
    pool[item.module].push(item);
  }

  return { menus, pool };
}
