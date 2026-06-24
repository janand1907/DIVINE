import type { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { fetchSeoContext, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PackageCard } from '@/components/packages/package-card';
import { SectionHeading } from '@/components/layout/section-heading';
import { PackageSortSelect } from '@/components/packages/package-sort-select';
import type { PackageRow, PackageCategoryRow } from '@/types/database';

export async function generateMetadata(): Promise<Metadata> {
  const { theme, site, seoPage } = await fetchSeoContext('/packages');
  return buildMetadata({ path: '/packages', theme, site, seoPage });
}

interface PackagesPageProps {
  searchParams: { category?: string; sort?: string; q?: string };
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const supabase = createPublicClient();
  const { theme } = await fetchSeoContext('/packages');

  // Fetch all categories for the filter sidebar.
  const { data: categories } = await supabase
    .from('package_categories')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .returns<PackageCategoryRow[]>();

  // Build package query.
  let query = supabase.from('packages').select('*').eq('is_published', true);

  const activeCategory = searchParams.category;
  if (activeCategory) {
    const cat = (categories ?? []).find((c) => c.slug === activeCategory);
    if (cat) {
      // Include packages directly assigned, plus packages whose category's parent matches.
      const childIds = (categories ?? [])
        .filter((c) => c.parent_id === cat.id)
        .map((c) => c.id);
      const catIds = [cat.id, ...childIds];
      query = query.in('category_id', catIds);
    }
  }

  if (searchParams.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,overview.ilike.%${searchParams.q}%`);
  }

  const sort = searchParams.sort ?? 'updated';
  if (sort === 'price_low') query = query.order('starting_price', { ascending: true, nullsFirst: false });
  else if (sort === 'price_high') query = query.order('starting_price', { ascending: false, nullsFirst: false });
  else if (sort === 'duration') query = query.order('duration_days', { ascending: false });
  else query = query.order('updated_at', { ascending: false });

  const { data: packages } = await query.returns<PackageRow[]>();

  return (
    <>
      <section className="bg-brand-dark py-12 text-brand-darkForeground">
        <div className="container-brand">
          <Breadcrumb
            items={[{ name: 'Home', href: '/' }, { name: 'Packages', href: '/packages' }]}
          />
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
            Explore Tour Packages
          </h1>
          <p className="mt-2 max-w-2xl text-brand-darkForeground/80">
            Browse our curated pilgrimage and leisure tours. Filter by category, search by name, or sort to find your perfect journey.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container-brand grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar — categories */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-5 shadow-brand">
              <h2 className="font-heading text-lg font-semibold text-foreground">Categories</h2>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link
                    href="/packages"
                    className={`block rounded-md px-3 py-2 text-sm transition hover:bg-accent ${
                      !activeCategory ? 'bg-primary/10 font-medium text-primary' : 'text-foreground'
                    }`}
                  >
                    All Packages
                  </Link>
                </li>
                {(categories ?? [])
                  .filter((c) => !c.parent_id)
                  .map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/packages?category=${cat.slug}`}
                        className={`block rounded-md px-3 py-2 text-sm transition hover:bg-accent ${
                          activeCategory === cat.slug
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-foreground'
                        }`}
                      >
                        {cat.name}
                      </Link>
                      <ul className="ml-3 border-l border-border pl-2">
                        {(categories ?? [])
                          .filter((c) => c.parent_id === cat.id)
                          .map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/packages?category=${sub.slug}`}
                                className={`block rounded-md px-3 py-1.5 text-xs transition hover:bg-accent ${
                                  activeCategory === sub.slug ? 'font-medium text-primary' : 'text-muted-foreground'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          {/* Main list */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {(packages ?? []).length} package{(packages ?? []).length === 1 ? '' : 's'} found
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-muted-foreground">Sort:</label>
                <PackageSortSelect defaultValue={sort} />
              </div>
            </div>

            {(packages ?? []).length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center shadow-brand">
                <SectionHeading title="No packages found" subtitle="Try clearing filters or browsing all categories." align="center" />
                <div className="mt-6 text-center">
                  <Link href="/packages" className="inline-flex rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground">
                    Reset Filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {(packages ?? []).map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
