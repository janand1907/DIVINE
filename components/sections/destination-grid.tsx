import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import type { DestinationRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export async function DestinationGrid({ config }: Props) {
  const heading = (config.heading as string) || '';
  const region = (config.region as string) || '';
  const limit = (config.limit as number) || 6;

  const supabase = createPublicClient();
  let query = supabase.from('destinations').select('*').eq('is_published', true);
  if (region && region !== 'all') query = query.eq('region', region);
  const { data } = await query.order('display_order', { ascending: true }).limit(limit);
  const destinations = (data ?? []) as DestinationRow[];

  if (destinations.length === 0) return null;

  const fallbackImg = 'https://images.pexels.com/photos/3596389/pexels-photo-3596389.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => {
            const regionSlug = d.region === 'divine' ? 'divine-tours' : d.region === 'domestic' ? 'domestic-tours' : 'international-tours';
            return (
              <Link
                key={d.id}
                href={`/${regionSlug}/${d.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.cover_image ?? fallbackImg}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {d.badge_text && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {d.badge_text}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{d.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> India
                  </p>
                  {d.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
