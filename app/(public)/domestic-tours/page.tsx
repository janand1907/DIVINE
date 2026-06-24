import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { DestinationRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/domestic-tours');
  return buildMetadata({ path: '/domestic-tours', theme, site, seoPage });
}

export default async function DomesticToursPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('region', 'domestic')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .returns<DestinationRow[]>();

  const destinations = data ?? [];
  const fallbackImg =
    'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'Domestic Tours', href: '/domestic-tours' },
            ]}
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
            Domestic Tours
          </h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Discover India beyond pilgrimage — hill stations, beaches, heritage cities, and more.
          </p>
        </div>
      </section>

      {/* Destinations grid */}
      <section className="bg-background py-12">
        <div className="container-brand">
          {destinations.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                No domestic destinations available yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Please check back soon for our curated domestic tours.
              </p>
              <Link
                href="/packages"
                className="mt-6 inline-flex rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground"
              >
                Browse All Packages
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/domestic-tours/${d.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-brand transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.cover_image ?? fallbackImg}
                      alt={d.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      Domestic
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {d.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      India
                    </p>
                    {d.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {d.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
