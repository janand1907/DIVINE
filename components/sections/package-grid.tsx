import { createPublicClient } from '@/lib/supabase/server';
import { PackageCard } from '@/components/packages/package-card';
import type { PackageRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
  entityId?: string;
}

export async function PackageGrid({ config, entityId }: Props) {
  const heading = (config.heading as string) || '';
  const source = (config.source as string) || 'featured';
  const categoryId = (config.category_id as string) || '';
  const destinationId = (config.destination_id as string) || entityId || '';
  const tags = (config.tags as string[]) || [];
  const manualIds = (config.manual_ids as string[]) || [];
  const limit = (config.limit as number) || 6;

  const supabase = createPublicClient();
  let query = supabase.from('packages').select('*').eq('is_published', true);

  if (source === 'featured') query = query.eq('is_featured', true);
  else if (source === 'category' && categoryId) query = query.eq('category_id', categoryId);
  else if (source === 'destination' && destinationId) query = query.eq('destination_id', destinationId);
  else if (source === 'tags' && tags.length > 0) query = query.overlaps('highlights', tags);
  else if (source === 'manual' && manualIds.length > 0) query = query.in('id', manualIds);

  const { data } = await query.order('created_at', { ascending: false }).limit(limit);
  const packages = (data ?? []) as PackageRow[];

  if (packages.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
