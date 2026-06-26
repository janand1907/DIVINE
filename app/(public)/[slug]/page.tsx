import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { PageRenderer } from '@/components/sections/page-renderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import type { ContentPageRow, CmsPageRow, FaqItem } from '@/types/database';

export const dynamic = 'force-dynamic';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();

  const { data: page } = await supabase
    .from('content_pages')
    .select('title,seo_title,seo_description,og_image,canonical_path')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (page) {
    const { theme, site, seoPage } = await fetchSeoContext(`/${params.slug}`);
    return buildMetadata({
      path: `/${params.slug}`,
      title: page.seo_title ?? page.title,
      description: page.seo_description ?? undefined,
      ogImage: page.og_image ?? undefined,
      canonicalPath: page.canonical_path ?? `/${params.slug}`,
      theme, site, seoPage,
    });
  }

  const { data: legacy } = await supabase
    .from('cms_pages')
    .select('title,seo_title,seo_description,og_image,canonical_path')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!legacy) return { title: 'Page Not Found' };

  const { theme, site, seoPage } = await fetchSeoContext(`/${params.slug}`);
  return buildMetadata({
    path: `/${params.slug}`,
    title: legacy.seo_title ?? legacy.title,
    description: legacy.seo_description ?? undefined,
    ogImage: legacy.og_image ?? undefined,
    canonicalPath: legacy.canonical_path ?? `/${params.slug}`,
    theme, site, seoPage,
  });
}

export default async function DynamicPage({ params }: Props) {
  const supabase = createPublicClient();

  const { data: page } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<ContentPageRow>();

  if (page) {
    return <PageRenderer entityType="content_page" entityId={page.id} />;
  }

  const { data: legacy } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<CmsPageRow>();

  if (!legacy) notFound();

  return <LegacyCmsPage page={legacy} />;
}

function LegacyCmsPage({ page }: { page: CmsPageRow }) {
  return (
    <>
      <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-brand-dark">
        {page.hero_image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${page.hero_image}')` }}
          />
        )}
        <div className="container-brand relative z-10 py-20 text-center text-white">
          <Badge className="mb-4 bg-primary/20 text-primary capitalize">{page.page_type}</Badge>
          <h1 className="font-heading text-4xl font-bold leading-tight lg:text-5xl">
            {page.hero_heading ?? page.title}
          </h1>
          {page.hero_subheading && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">{page.hero_subheading}</p>
          )}
          {page.cta_text && page.cta_url && (
            <Button size="lg" asChild className="mt-8">
              <Link href={page.cta_url}>{page.cta_text}</Link>
            </Button>
          )}
        </div>
      </section>

      {page.content && (
        <section className="py-16">
          <div className="container-brand">
            <div
              className="mx-auto max-w-3xl prose prose-lg max-w-none text-muted-foreground [&_h2]:font-heading [&_h2]:text-foreground [&_h3]:font-heading [&_h3]:text-foreground [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      )}

      {page.gallery.length > 0 && (
        <section className="bg-muted/40 py-16">
          <div className="container-brand">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.gallery.map((url, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i + 1}`} className="h-56 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.faqs.length > 0 && (
        <section className="py-16">
          <div className="container-brand">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="mx-auto max-w-2xl divide-y divide-border">
              {page.faqs.map((faq: FaqItem, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-medium text-foreground">{faq.question}</span>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.cta_text && page.cta_url && (
        <section className="bg-brand-dark py-16 text-white">
          <div className="container-brand text-center">
            <h2 className="font-heading text-2xl font-bold">{page.cta_text}</h2>
            <Button size="lg" asChild className="mt-6">
              <Link href={page.cta_url}>{page.cta_text}</Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
