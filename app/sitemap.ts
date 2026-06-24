import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';

  const staticRoutes = [
    '', '/divine-tours', '/domestic-tours', '/international-tours',
    '/packages', '/blog', '/about', '/testimonials', '/gallery', '/faq', '/contact',
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }));

  const [pkgs, blogs, destinations, categories] = await Promise.all([
    supabase.from('packages').select('slug,updated_at,is_published,canonical_path').eq('is_published', true),
    supabase.from('blogs').select('slug,updated_at,is_published,published_at').eq('is_published', true),
    supabase.from('destinations').select('slug,region,updated_at,is_published').eq('is_published', true),
    supabase.from('package_categories').select('slug,parent_id,updated_at,is_published').eq('is_published', true),
  ]);

  const packageRoutes: MetadataRoute.Sitemap = (pkgs.data ?? []).map((p) => ({
    url: `${base}${p.canonical_path ?? `/packages/${p.slug}`}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogs.data ?? []).map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = (destinations.data ?? []).map((d) => ({
    url: `${base}/${d.region === 'divine' ? 'divine-tours' : d.region === 'domestic' ? 'domestic-tours' : 'international-tours'}/${d.slug}`,
    lastModified: new Date(d.updated_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...packageRoutes, ...blogRoutes, ...destinationRoutes];
}
