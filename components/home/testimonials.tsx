import { Star, Quote } from 'lucide-react';
import type { TestimonialRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';

interface TestimonialsSectionProps {
  heading: string;
  testimonials: TestimonialRow[];
}

const avatarFallback = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
];

export function TestimonialsSection({ heading, testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;
  return (
    <section className="section-py bg-[rgb(var(--color-neutral-50))]">
      <div className="container-brand">
        <SectionHeading
          title={heading}
          subtitle="Real experiences from our happy travelers"
          eyebrow="Testimonials"
        />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, idx) => (
            <article
              key={t.id}
              className="relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:shadow-[var(--shadow-md)]"
            >
              {/* Quote icon */}
              <Quote
                className="absolute right-5 top-5 h-10 w-10 text-primary/10 rotate-180"
                aria-hidden
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating
                        ? 'h-4 w-4 fill-[rgb(var(--color-warning-300))] text-[rgb(var(--color-warning-300))]'
                        : 'h-4 w-4 text-border'
                    }
                    aria-hidden
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80 line-clamp-4">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Divider */}
              <div className="my-4 h-px bg-border" />

              {/* Author */}
              <footer className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar_url ?? avatarFallback[idx % avatarFallback.length]}
                  alt={t.author_name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{t.author_name}</p>
                  {t.author_location && (
                    <p className="text-xs text-muted-foreground">{t.author_location}</p>
                  )}
                </div>
                {t.tour_taken && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                    {t.tour_taken}
                  </span>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
