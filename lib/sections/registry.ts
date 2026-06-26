import type { SectionType, SectionEntityType, PageSectionRow } from '@/types/database';
import { createPublicClient } from '@/lib/supabase/server';

export { SECTION_TYPE_META, SECTION_GROUPS } from './meta';

export interface SectionComponentProps {
  config: Record<string, unknown>;
  entityId?: string;
  entityType?: SectionEntityType;
}

export async function fetchSections(
  entityType: SectionEntityType,
  entityId: string
): Promise<PageSectionRow[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('is_enabled', true)
    .order('display_order', { ascending: true });

  return (data ?? []) as PageSectionRow[];
}

export async function fetchAllSections(
  entityType: SectionEntityType,
  entityId: string
): Promise<PageSectionRow[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('display_order', { ascending: true });

  return (data ?? []) as PageSectionRow[];
}
