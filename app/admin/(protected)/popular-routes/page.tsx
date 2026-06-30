import { createAdminClient } from '@/lib/supabase/server';
import { PopularRoutesManager } from '@/components/admin/popular-routes-manager';
import type { PopularRouteCategoryWithRoutes } from '@/types/database';

export const metadata = { title: 'Popular Taxi Routes — Admin' };

export default async function AdminPopularRoutesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('popular_route_categories')
    .select('*, popular_routes(*)')
    .order('display_order');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Popular Taxi Routes</h2>
        <p className="text-sm text-muted-foreground">Manage SEO route categories and links shown on public pages</p>
      </div>
      <PopularRoutesManager initialCategories={(data ?? []) as PopularRouteCategoryWithRoutes[]} />
    </div>
  );
}
