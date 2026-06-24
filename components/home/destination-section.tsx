import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { DestinationRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';

interface DestinationSectionProps {
  heading: string;
  subheading?: string;
  destinations: DestinationRow[];
  basePath: string; // e.g., /divine-tours, /domestic-tours
  ctaLabel?: string;
}

// Pool of fallback Pexels images (only used if destination has no cover_image)
const fallbackImages = [
  'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/357903/pexels-photo-357903.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export function DestinationSection({
  heading,
  subheading,
  destinations,
  basePath,
  ctaLabel = 'View All',
}: DestinationSectionProps) {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle={subheading} />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {destinations.slice(0, 8).map((dest, idx) => {
            const img = dest.cover_image ?? fallbackImages[idx % fallbackImages.length];
            return (
              <Link
                key={dest.id}
                href={`${basePath}/${dest.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-brand"
              >
                <div className="aspect-[4/5] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={dest.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-heading text-lg font-semibold text-brand-darkForeground">
                    {dest.name}
                  </h3>
                  {dest.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-brand-darkForeground/80">
                      {dest.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-2.5 font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
