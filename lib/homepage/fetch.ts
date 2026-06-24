import { createPublicClient } from '@/lib/supabase/server';
import type {
  DestinationRow,
  HomepageSection,
  PackageRow,
  TestimonialRow,
  BlogRow,
} from '@/types/database';

export async function fetchHomepageData() {
  const supabase = createPublicClient();

  const [
    sectionsRes,
    divineRes,
    domesticRes,
    intlRes,
    featuredRes,
    testimonialsRes,
    blogsRes,
  ] = await Promise.all([
    supabase.from('homepage_sections').select('*').order('display_order', { ascending: true }),
    supabase.from('destinations').select('*').eq('region', 'divine').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('destinations').select('*').eq('region', 'domestic').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('destinations').select('*').eq('region', 'international').eq('is_published', true).order('display_order', { ascending: true }),
    supabase.from('packages').select('*').eq('is_published', true).eq('is_featured', true).order('updated_at', { ascending: false }).limit(6),
    supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(8),
    supabase.from('blogs').select('*').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
  ]);

  return {
    sections: (sectionsRes.data ?? []) as HomepageSection[],
    divineDestinations: (divineRes.data ?? []) as DestinationRow[],
    domesticDestinations: (domesticRes.data ?? []) as DestinationRow[],
    internationalDestinations: (intlRes.data ?? []) as DestinationRow[],
    featuredPackages: (featuredRes.data ?? []) as PackageRow[],
    testimonials: (testimonialsRes.data ?? []) as TestimonialRow[],
    blogs: (blogsRes.data ?? []) as BlogRow[],
  };
}
