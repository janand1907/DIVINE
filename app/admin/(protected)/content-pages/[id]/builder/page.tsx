import { createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PageBuilderClient } from '@/components/admin/page-builder-client';
import type { ContentPageRow, PageSectionRow } from '@/types/database';

interface Props {
  params: { id: string };
}

export default async function PageBuilderPage({ params }: Props) {
  const supabase = createAdminClient();

  const { data: page, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !page) return notFound();

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('entity_type', 'content_page')
    .eq('entity_id', params.id)
    .order('display_order', { ascending: true });

  return (
    <PageBuilderClient
      page={page as ContentPageRow}
      initialSections={(sections ?? []) as PageSectionRow[]}
    />
  );
}
