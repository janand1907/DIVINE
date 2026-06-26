import Link from 'next/link';
import { Users } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import type { VehicleRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
  entityId?: string;
}

export async function VehicleGrid({ config, entityId }: Props) {
  const heading = (config.heading as string) || '';
  const source = (config.source as string) || 'featured';
  const categoryId = (config.category_id as string) || entityId || '';
  const limit = (config.limit as number) || 6;

  const supabase = createPublicClient();
  let query = supabase.from('vehicles').select('*').eq('is_published', true);

  if (source === 'featured') query = query.eq('is_featured', true);
  else if (source === 'category' && categoryId) query = query.eq('category_id', categoryId);

  const { data } = await query.order('created_at', { ascending: false }).limit(limit);
  const vehicles = (data ?? []) as VehicleRow[];

  if (vehicles.length === 0) return null;

  const fallbackImg = 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Link
              key={v.id}
              href={`/vehicle-rentals/${v.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.cover_image ?? v.images?.[0] ?? fallbackImg}
                  alt={v.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {v.badge_text && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {v.badge_text}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">{v.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {v.seats} seats
                  {v.is_ac && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">AC</span>}
                </p>
                {v.starting_price != null && (
                  <p className="mt-2 font-medium text-foreground">
                    From ₹{v.starting_price.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
