import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { BlogRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';

interface BlogSectionProps {
  heading: string;
  posts: BlogRow[];
}

const fallbackCovers = [
  'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export function BlogSection({ heading, posts }: BlogSectionProps) {
  if (posts.length === 0) return null;
  return (
    <section className="section-py bg-background">
      <div className="container-brand">
        <SectionHeading
          title={heading}
          subtitle="Insights, guides, and travel tips from our experts"
          eyebrow="Travel Blog"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post, idx) => {
            const cover = post.cover_image ?? fallbackCovers[idx % fallbackCovers.length];
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  {post.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-white">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-[15px] font-semibold text-foreground line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {post.reading_time_minutes} min read
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:underline">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/blog">
              Read All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
