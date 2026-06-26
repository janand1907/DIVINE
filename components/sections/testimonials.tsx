import { Star } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import type { TestimonialRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export async function Testimonials({ config }: Props) {
  const heading = (config.heading as string) || '';
  const source = (config.source as string) || 'featured';
  const limit = (config.limit as number) || 6;
  const manualIds = (config.manual_ids as string[]) || [];

  const supabase = createPublicClient();
  let query = supabase.from('testimonials').select('*').eq('is_published', true);
  if (source === 'manual' && manualIds.length > 0) query = query.in('id', manualIds);

  const { data } = await query.order('created_at', { ascending: false }).limit(limit);
  const testimonials = (data ?? []) as TestimonialRow[];

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                {t.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar_url} alt={t.author_name} className="h-9 w-9 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{t.author_name}</p>
                  {t.author_location && (
                    <p className="text-xs text-muted-foreground">{t.author_location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
