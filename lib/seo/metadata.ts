import type { Metadata } from 'next';
import type { SeoPageRow, SiteSettingsRow, ThemeSettingsRow } from '@/types/database';

interface BuildMetadataArgs {
  path: string;
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalPath?: string;
  seoPage?: Pick<SeoPageRow, 'seo_title' | 'seo_description' | 'og_image' | 'canonical_path' | 'robots_index'> | null;
  site?: SiteSettingsRow | null;
  theme?: ThemeSettingsRow | null;
  noIndex?: boolean;
}

export async function buildMetadata({
  path,
  title,
  description,
  ogImage,
  canonicalPath,
  seoPage,
  site,
  theme,
  noIndex,
}: BuildMetadataArgs): Promise<Metadata> {
  const resolvedTitle =
    (seoPage?.seo_title ?? title ?? '').trim() ||
    `${theme?.brand_name ?? 'Divine Travel'} — Sacred Journeys Across India`;
  const resolvedDescription =
    (seoPage?.seo_description ?? description ?? '').trim() ||
    'Premium pilgrimage and leisure tours from Chennai. Navagraha, Tirupati, Rameswaram, Char Dham, Kailash Mansarovar and more.';
  const resolvedCanonical =
    (seoPage?.canonical_path ?? canonicalPath ?? path).trim() || path;
  const resolvedOg = seoPage?.og_image || ogImage || site?.default_og_image || undefined;
  const noIndexFinal = noIndex ?? (seoPage?.robots_index === false);
  const siteUrl = (site?.site_url ?? '').replace(/\/$/, '') || undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    alternates: {
      canonical: resolvedCanonical,
    },
    robots: noIndexFinal
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: siteUrl ? `${siteUrl}${resolvedCanonical}` : resolvedCanonical,
      siteName: theme?.brand_name ?? 'Divine Travel',
      images: resolvedOg ? [{ url: resolvedOg, width: 1200, height: 630 }] : undefined,
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedOg ? [resolvedOg] : undefined,
    },
  };
}

/**
 * Fetch global context (theme + site settings + per-path seo override) in one pass.
 *
 * Uses `createPublicClient()` (never touches cookies) so this is safe to call
 * from `generateMetadata`, `generateStaticParams`, and other contexts where
 * Next.js request storage is unavailable.
 */
export async function fetchSeoContext(path: string) {
  const { createPublicClient } = await import('@/lib/supabase/server');
  const supabase = createPublicClient();

  const [themeRes, siteRes, seoRes] = await Promise.all([
    supabase.from('theme_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('seo_pages').select('*').eq('path', path).maybeSingle(),
  ]);

  return {
    theme: themeRes.data ?? null,
    site: siteRes.data ?? null,
    seoPage: seoRes.data ?? null,
  };
}

/** Compute reading time (avg 200 wpm) for blog content. */
export function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
