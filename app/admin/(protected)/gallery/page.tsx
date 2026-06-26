import { requireAdmin } from '@/lib/admin/guard';
import { createAdminClient } from '@/lib/supabase/server';
import type { GalleryItemRow } from '@/types/database';
import { GalleryManager } from '@/components/admin/gallery-manager';

export const metadata = { title: 'Gallery — Admin' };

export default async function GalleryPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Gallery</h1>
        <p className="text-muted-foreground">Manage gallery images shown on the public gallery page.</p>
      </div>
      <GalleryManager initialItems={(data as GalleryItemRow[]) ?? []} />
    </div>
  );
}
