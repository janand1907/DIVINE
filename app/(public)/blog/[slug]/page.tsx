import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/components/layout/json-ld';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { TableOfContents } from '@/components/blog/table-of-contents';
import type { BlogRow } from '@/types/database';
export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<BlogRow>();
  if (!blog) return { title: 'Post not found' };

  const { theme, site, seoPage } = await fetchSeoContext(`/blog/${params.slug}`);
  return buildMetadata({
    path: `/blog/${params.slug}`,
    title: blog.seo_title ?? blog.title,
    description: blog.seo_description ?? blog.excerpt ?? '',
    ogImage: blog.og_image ?? blog.cover_image ?? undefined,
    canonicalPath: blog.canonical_path ?? `/blog/${params.slug}`,
    theme, site, seoPage,
  });
}

/** Minimal markdown renderer: headings, lists, paragraphs, bold, links. */
function renderMarkdown(md: string) {
  // Split into lines and group consecutive lines into blocks.
  const lines = md.split('\n');
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (idx: number) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${idx}`} className="my-4 list-disc space-y-1 pl-6 text-foreground/90">
        {listBuffer.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  const inline = (text: string) =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>');

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      flushList(i);
      blocks.push(<h3 key={i} className="mt-6 font-heading text-lg font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: inline(trimmed.slice(4)) }} />);
    } else if (trimmed.startsWith('## ')) {
      flushList(i);
      blocks.push(<h2 key={i} className="mt-8 font-heading text-xl font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: inline(trimmed.slice(3)) }} />);
    } else if (trimmed.startsWith('# ')) {
      flushList(i);
      blocks.push(<h1 key={i} className="mt-8 font-heading text-2xl font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: inline(trimmed.slice(2)) }} />);
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Ordered list item
      flushList(i);
      blocks.push(
        <ol key={`ol-${i}`} className="my-4 list-decimal space-y-1 pl-6 text-foreground/90">
          <li dangerouslySetInnerHTML={{ __html: inline(trimmed.replace(/^\d+\.\s/, '')) }} />
        </ol>,
      );
    } else if (/^[-*]\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*]\s/, ''));
    } else if (trimmed === '') {
      flushList(i);
    } else {
      flushList(i);
      blocks.push(<p key={i} className="my-3 leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: inline(trimmed) }} />);
    }
  });
  flushList(lines.length);
  return blocks;
}

export default async function BlogDetailPage({ params }: Props) {
  const supabase = createPublicClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle<BlogRow>();

  if (!blog) notFound();

  const { theme, site } = await fetchSeoContext(`/blog/${params.slug}`);
  const brandName = theme?.brand_name ?? 'Divine Travel';
  const siteUrl = site?.site_url ?? undefined;

  const { data: related } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .neq('id', blog.id)
    .ilike('category', blog.category ?? '%')
    .order('published_at', { ascending: false })
    .limit(2)
    .returns<BlogRow[]>();

  const publishedDate = blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: blog.title, url: `/blog/${blog.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={articleJsonLd(blog, brandName, siteUrl)} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-brand-darkForeground">
        {blog.cover_image && (
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${blog.cover_image})` }}
            aria-hidden
          />
        )}
        <div className="container-brand py-16 md:py-20">
          <div className="max-w-3xl">
            <Breadcrumb items={[
              { name: 'Home', href: '/' },
              { name: 'Blog', href: '/blog' },
            ]} className="text-brand-darkForeground/80 [&_*]:text-brand-darkForeground/80" />
            {blog.category && (
              <span className="mt-4 inline-block text-sm font-medium uppercase tracking-wide text-primary">{blog.category}</span>
            )}
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl text-balance">{blog.title}</h1>
            {blog.excerpt && <p className="mt-4 max-w-2xl text-lg text-brand-darkForeground/85 text-balance">{blog.excerpt}</p>}
            <div className="mt-6 flex items-center gap-4 text-sm text-brand-darkForeground/80">
              <span>{blog.author}</span>
              {publishedDate && (
                <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {publishedDate}</span>
              )}
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {blog.reading_time_minutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-background py-12">
        <div className="container-brand grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <article className="prose prose-lg max-w-none">
            {renderMarkdown(blog.content)}
          </article>
          <aside>
            <TableOfContents />
          </aside>
        </div>
      </section>

      {/* Related */}
      {(related ?? []).length > 0 && (
        <section className="bg-accent py-12">
          <div className="container-brand">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Related Posts</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {(related ?? []).map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-brand transition hover:-translate-y-0.5">
                  {rp.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={rp.cover_image} alt={rp.title} className="h-16 w-24 flex-shrink-0 rounded-md object-cover" loading="lazy" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-heading font-medium text-foreground line-clamp-2 group-hover:text-primary">{rp.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{rp.reading_time_minutes} min read</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-brand py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to all posts
        </Link>
      </div>
    </>
  );
}
