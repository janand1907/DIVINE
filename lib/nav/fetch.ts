import { createPublicClient } from '@/lib/supabase/server';
import type { NavMenuWithItems } from '@/types/database';

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
