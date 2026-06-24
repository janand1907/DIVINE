import type { Metadata } from 'next';
import { Image as ImageIcon } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import type { GalleryItemRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/gallery');
  return buildMetadata({ path: '/gallery', theme, site, seoPage });
}

export default async function GalleryPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .returns<GalleryItemRow[]>();

  const items = data ?? [];
  const { site } = await fetchSeoContext('/gallery');
  const siteUrl = site?.site_url ?? undefined;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'Gallery', href: '/gallery' },
            ]}
            siteUrl={siteUrl}
          />
          <div className="mt-4 flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-brand-darkForeground/70" aria-hidden />
            <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
              Gallery
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Moments captured from our travelers' journeys across temples, hills, beaches, and beyond.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-background py-12">
        <div className="container-brand">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                No images in the gallery yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Please check back soon for photos from our recent tours.
              </p>
            </div>
          ) : (
            <GalleryGrid items={items} />
          )}
        </div>
      </section>
    </>
  );
}
