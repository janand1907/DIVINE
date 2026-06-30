import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import type { PopularRouteCategoryWithRoutes } from '@/types/database';

interface PopularRoutesSectionProps {
  categories: PopularRouteCategoryWithRoutes[];
  title?: string;
}

export function PopularRoutesSection({ categories, title = 'Popular Taxi Routes' }: PopularRoutesSectionProps) {
  const visible = categories.filter((c) => c.is_visible && c.popular_routes.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="section-py bg-[rgb(var(--color-neutral-50))]">
      <div className="container-brand">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Taxi Routes</span>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">Browse popular taxi and transfer routes across South India.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((cat) => (
            <div
              key={cat.id}
              className="rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-sm)] overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <h3 className="font-heading text-sm font-semibold text-foreground">{cat.name}</h3>
              </div>

              {/* Route links */}
              <ul className="max-h-64 overflow-y-auto divide-y divide-border/60 px-1 py-1">
                {cat.popular_routes
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((route) => (
                    <li key={route.id}>
                      <Link
                        href={route.url}
                        className="group flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                      >
                        <span className="truncate">{route.label}</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
