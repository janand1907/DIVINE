import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PackageRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';
import { PackageCard } from '@/components/packages/package-card';

interface FeaturedPackagesProps {
  heading: string;
  packages: PackageRow[];
}

export function FeaturedPackages({ heading, packages }: FeaturedPackagesProps) {
  if (packages.length === 0) return null;
  return (
    <section className="bg-accent py-16 md:py-20">
      <div className="container-brand">
        <SectionHeading title={heading} subtitle="Hand-picked popular journeys from our catalog" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            View All Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
