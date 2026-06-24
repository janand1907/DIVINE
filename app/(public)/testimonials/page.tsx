import type { Metadata } from 'next';
import { Star, Quote } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeading } from '@/components/layout/section-heading';
import type { TestimonialRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/testimonials');
  return buildMetadata({ path: '/testimonials', theme, site, seoPage });
}

const avatarFallback = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
];

export default async function TestimonialsPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .returns<TestimonialRow[]>();

  const testimonials = data ?? [];
  const { site } = await fetchSeoContext('/testimonials');
  const siteUrl = site?.site_url ?? undefined;

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'Testimonials', href: '/testimonials' },
            ]}
            siteUrl={siteUrl}
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
            Traveler Testimonials
          </h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Real experiences from pilgrims and travelers who journeyed with us.
          </p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="bg-accent py-16">
        <div className="container-brand">
          {testimonials.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <SectionHeading
                title="No testimonials yet"
                subtitle="Be among the first to share your travel experience."
                align="center"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <article
                  key={t.id}
                  className="relative rounded-lg border border-border bg-card p-6 shadow-brand"
                >
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20" aria-hidden />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < t.rating
                            ? 'h-4 w-4 fill-secondary text-secondary'
                            : 'h-4 w-4 text-muted-foreground/30'
                        }
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-foreground">{t.content}</p>
                  <footer className="mt-5 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar_url ?? avatarFallback[idx % avatarFallback.length]}
                      alt={t.author_name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-foreground">{t.author_name}</p>
                      {t.author_location && (
                        <p className="text-xs text-muted-foreground">{t.author_location}</p>
                      )}
                    </div>
                    {t.tour_taken && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {t.tour_taken}
                      </span>
                    )}
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
