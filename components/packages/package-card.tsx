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
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-brand transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={pkg.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {pkg.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2">
          {pkg.title}
        </h3>
        {pkg.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{pkg.subtitle}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {pkg.duration_days}D / {pkg.duration_nights}N
          </span>
          {pkg.starting_price != null && (
            <span className="inline-flex items-center font-medium text-foreground">
              <IndianRupee className="h-4 w-4" />
              {pkg.starting_price.toLocaleString('en-IN')}
              <span className="ml-1 text-muted-foreground">onwards</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
