import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, Search } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { BlogSearchClient } from '@/components/blog/blog-search-client';
import type { BlogRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/blog');
  return buildMetadata({ path: '/blog', theme, site, seoPage });
}

interface Props {
  searchParams: { category?: string; q?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const supabase = createPublicClient();

  const { data: categories } = await supabase
    .from('blogs')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null);

  const uniqueCategories = Array.from(
    new Set((categories ?? []).map((c) => c.category).filter(Boolean) as string[]),
  );

  let query = supabase.from('blogs').select('*').eq('is_published', true);
  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,excerpt.ilike.%${searchParams.q}%`);
  }
  const { data: posts } = await query.order('published_at', { ascending: false }).returns<BlogRow[]>();

  const fallbackCover = 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <>
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]} />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Divine Travel Blog</h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Travel tips, pilgrimage guides, and stories from the road.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container-brand">
          {/* Filter + search bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BlogSearchClient
              categories={uniqueCategories}
              activeCategory={searchParams.category}
              initialQuery={searchParams.q ?? ''}
            />
          </div>

          {(posts ?? []).length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <Search className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-3 font-heading text-lg font-semibold">No posts found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try a different category or search term.</p>
              <Link href="/blog" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                View all posts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(posts ?? []).map((post) => {
                const cover = post.cover_image ?? fallbackCover;
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-brand transition hover:-translate-y-1"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {post.category && (
                        <span className="text-xs font-medium uppercase tracking-wide text-secondary">{post.category}</span>
                      )}
                      <h2 className="mt-2 font-heading text-lg font-semibold text-foreground line-clamp-2">{post.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.reading_time_minutes} min</span>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">Read <ArrowRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
