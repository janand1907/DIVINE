import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { BlogRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';

interface BlogSectionProps {
  heading: string;
  posts: BlogRow[];
}

const fallbackCover = 'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=800';

export function BlogSection({ heading, posts }: BlogSectionProps) {
  if (posts.length === 0) return null;
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle="Insights, guides, and travel tips" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => {
            const cover = post.cover_image ?? fallbackCover;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-brand transition hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {post.category && (
                    <span className="text-xs font-medium uppercase tracking-wide text-secondary">
                      {post.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {post.reading_time_minutes} min read
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2.5 font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Read All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
