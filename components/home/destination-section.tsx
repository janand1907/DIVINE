import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { DestinationRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';

interface DestinationSectionProps {
  heading: string;
  subheading?: string;
  destinations: DestinationRow[];
  basePath: string;
  ctaLabel?: string;
}

const fallbackImages = [
  'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/357903/pexels-photo-357903.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export function DestinationSection({
  heading,
  subheading,
  destinations,
  basePath,
  ctaLabel = 'View All',
}: DestinationSectionProps) {
  const items = destinations.slice(0, 8);

  return (
    <section className="section-py bg-background">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle={subheading} />

        {items.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {items.map((dest, idx) => {
              const img = dest.cover_image ?? fallbackImages[idx % fallbackImages.length];
              return (
                <Link
                  key={dest.id}
                  href={`${basePath}/${dest.slug}`}
                  className="group relative overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={dest.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
                      loading="lazy"
                    />
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-heading text-base font-semibold text-white leading-snug">
                      {dest.name}
                    </h3>
                    {dest.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-white/75">
                        {dest.description}
                      </p>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-muted/50 p-12 text-center">
            <p className="text-muted-foreground">Tours coming soon. Check back shortly.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href={basePath}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
