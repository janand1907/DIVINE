import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import type { AirportRouteRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export async function TransferGrid({ config }: Props) {
  const heading = (config.heading as string) || '';
  const fromCity = (config.from_city as string) || '';
  const routeType = (config.route_type as string) || '';
  const limit = (config.limit as number) || 6;

  const supabase = createPublicClient();
  let query = supabase.from('airport_routes').select('*').eq('is_active', true);
  if (fromCity) query = query.ilike('from_city', `%${fromCity}%`);
  if (routeType) query = query.eq('route_type', routeType);

  const { data } = await query.order('popular_rank', { ascending: false }).limit(limit);
  const routes = (data ?? []) as AirportRouteRow[];

  if (routes.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <Link
              key={r.id}
              href={`/airport-transfers/${r.slug}`}
              className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-heading text-base font-semibold text-foreground">
                {r.from_city} → {r.to_city}
              </h3>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {r.distance_km && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {r.distance_km} km
                  </span>
                )}
                {r.duration_hours && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {r.duration_hours}h
                  </span>
                )}
              </div>
              {r.vehicles.length > 0 && (
                <p className="mt-3 text-sm font-medium text-foreground">
                  From ₹{Math.min(...r.vehicles.map((v) => v.price)).toLocaleString('en-IN')}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
