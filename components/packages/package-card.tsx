import Link from 'next/link';
import { Clock, IndianRupee } from 'lucide-react';
import type { PackageRow } from '@/types/database';

interface PackageCardProps {
  pkg: PackageRow;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const cover =
    pkg.cover_image ??
    pkg.gallery?.[0] ??
    'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg?auto=compress&cs=tinysrgb&w=800';
  const href = pkg.canonical_path ?? `/packages/${pkg.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-sm)] transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={pkg.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {pkg.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            Featured
          </span>
        )}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {pkg.duration_days}D / {pkg.duration_nights}N
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-[15px] font-semibold text-foreground line-clamp-2 leading-snug">
          {pkg.title}
        </h3>
        {pkg.subtitle && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {pkg.subtitle}
          </p>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {pkg.starting_price != null ? (
            <div>
              <span className="text-[11px] text-muted-foreground">Starting from</span>
              <div className="flex items-center gap-0.5 font-heading font-bold text-foreground">
                <IndianRupee className="h-4 w-4 text-primary" />
                <span className="text-lg">{pkg.starting_price.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : <div />}
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
