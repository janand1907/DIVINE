import { createAdminClient } from '@/lib/supabase/server';
import { MediaUploader } from '@/components/admin/media-uploader';
import { MediaGrid } from '@/components/admin/media-grid';
import type { MediaAssetRow } from '@/types/database';

export default async function AdminMediaPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('media_assets')
    .select()
    .order('created_at', { ascending: false })
    .returns<MediaAssetRow[]>();

  const assets = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Media Library</h2>
          <p className="text-sm text-muted-foreground">{assets.length} assets</p>
        </div>
        <MediaUploader />
      </div>
      <MediaGrid items={assets} />
    </div>
  );
}
