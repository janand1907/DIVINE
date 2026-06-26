import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import type { BlogRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export async function BlogGrid({ config }: Props) {
  const heading = (config.heading as string) || '';
  const source = (config.source as string) || 'latest';
  const category = (config.category as string) || '';
  const tags = (config.tags as string[]) || [];
  const manualIds = (config.manual_ids as string[]) || [];
  const limit = (config.limit as number) || 6;

  const supabase = createPublicClient();
  let query = supabase.from('blogs').select('*').eq('is_published', true);

  if (source === 'category' && category) query = query.eq('category', category);
  else if (source === 'tags' && tags.length > 0) query = query.overlaps('tags', tags);
  else if (source === 'manual' && manualIds.length > 0) query = query.in('id', manualIds);

  const { data } = await query.order('published_at', { ascending: false }).limit(limit);
  const blogs = (data ?? []) as BlogRow[];

  if (blogs.length === 0) return null;

  const fallbackImg = 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.cover_image ?? fallbackImg}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                {blog.category && (
                  <span className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{blog.category}</span>
                )}
                <h3 className="font-heading text-base font-semibold text-foreground line-clamp-2">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
                )}
                <p className="mt-auto pt-3 text-xs text-muted-foreground">
                  {blog.reading_time_minutes} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
