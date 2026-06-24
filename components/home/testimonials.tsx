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
];

export function TestimonialsSection({ heading, testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-accent py-16 md:py-20">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle="Real experiences from our travelers" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, idx) => (
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
                      i < t.rating ? 'h-4 w-4 fill-secondary text-secondary' : 'h-4 w-4 text-muted-foreground/30'
                    }
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-foreground line-clamp-4">{t.content}</p>
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
      </div>
    </section>
  );
}
