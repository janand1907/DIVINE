import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PackageRow } from '@/types/database';
import { SectionHeading } from '@/components/layout/section-heading';
import { PackageCard } from '@/components/packages/package-card';
import { Button } from '@/components/ui/button';

interface FeaturedPackagesProps {
  heading: string;
  packages: PackageRow[];
}

export function FeaturedPackages({ heading, packages }: FeaturedPackagesProps) {
  if (packages.length === 0) return null;
  return (
    <section className="section-py bg-[rgb(var(--color-neutral-50))]">
      <div className="container-brand">
        <SectionHeading
          title={heading}
          subtitle="Hand-picked popular journeys from our catalog"
          eyebrow="Top Picks"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/packages">
              View All Packages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
