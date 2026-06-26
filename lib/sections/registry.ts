import type { SectionType, SectionEntityType, PageSectionRow } from '@/types/database';
import { createPublicClient } from '@/lib/supabase/server';

export interface SectionComponentProps {
  config: Record<string, unknown>;
  entityId?: string;
  entityType?: SectionEntityType;
}

export const SECTION_TYPE_META: Record<SectionType, { label: string; group: string; icon: string }> = {
  hero_banner:      { label: 'Hero Banner',        group: 'Layout & Content', icon: 'Image' },
  rich_text:        { label: 'Rich Text',          group: 'Layout & Content', icon: 'FileText' },
  image_text_split: { label: 'Image + Text',       group: 'Layout & Content', icon: 'Columns' },
  image_gallery:    { label: 'Image Gallery',      group: 'Layout & Content', icon: 'Images' },
  image_banner:     { label: 'Image Banner',       group: 'Layout & Content', icon: 'ImagePlus' },
  video_section:    { label: 'Video',              group: 'Layout & Content', icon: 'Video' },
  timeline:         { label: 'Timeline',           group: 'Layout & Content', icon: 'Clock' },
  package_grid:     { label: 'Package Grid',       group: 'Data Sections',    icon: 'Package' },
  destination_grid: { label: 'Destination Grid',   group: 'Data Sections',    icon: 'MapPin' },
  vehicle_grid:     { label: 'Vehicle Grid',       group: 'Data Sections',    icon: 'Car' },
  transfer_grid:    { label: 'Transfer Grid',      group: 'Data Sections',    icon: 'Plane' },
  blog_grid:        { label: 'Blog Grid',          group: 'Data Sections',    icon: 'FileText' },
  testimonials:     { label: 'Testimonials',       group: 'Data Sections',    icon: 'Star' },
  faq:              { label: 'FAQ',                group: 'Engagement',       icon: 'HelpCircle' },
  feature_cards:    { label: 'Feature Cards',      group: 'Engagement',       icon: 'Grid3x3' },
  statistics:       { label: 'Statistics',         group: 'Engagement',       icon: 'TrendingUp' },
  pricing_cards:    { label: 'Pricing Cards',      group: 'Engagement',       icon: 'IndianRupee' },
  enquiry_form:     { label: 'Enquiry Form',       group: 'Conversion',       icon: 'Send' },
  cta_banner:       { label: 'CTA Banner',         group: 'Conversion',       icon: 'Megaphone' },
  whatsapp_cta:     { label: 'WhatsApp CTA',       group: 'Conversion',       icon: 'MessageCircle' },
  google_map:       { label: 'Google Map',         group: 'Conversion',       icon: 'Map' },
  html_block:       { label: 'HTML Block',         group: 'Advanced',         icon: 'Code' },
};

export const SECTION_GROUPS = ['Layout & Content', 'Data Sections', 'Engagement', 'Conversion', 'Advanced'] as const;

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
