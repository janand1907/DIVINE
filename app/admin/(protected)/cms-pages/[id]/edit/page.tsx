import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { CmsPageForm } from '@/components/admin/cms-page-form';
import type { CmsPageRow } from '@/types/database';

export default async function EditCmsPagePage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data } = await supabase.from('cms_pages').select().eq('id', params.id).single<CmsPageRow>();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Edit Page</h2>
        <p className="text-sm text-muted-foreground font-mono">/{data.slug}</p>
      </div>
      <CmsPageForm initial={data} />
    </div>
  );
}
