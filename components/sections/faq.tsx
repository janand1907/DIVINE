import { ChevronDown } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import type { FaqItem, FaqRow } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export async function Faq({ config }: Props) {
  const heading = (config.heading as string) || 'Frequently Asked Questions';
  const source = (config.source as string) || 'manual';
  const categoryId = (config.category_id as string) || '';
  const limit = (config.limit as number) || 20;
  const manualFaqs = (config.faqs as FaqItem[]) || [];

  let faqs: FaqItem[] = manualFaqs;

  if (source === 'db' || source === 'all') {
    const supabase = createPublicClient();
    let query = supabase
      .from('faqs')
      .select('question,answer')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (categoryId) query = query.eq('category_id', categoryId);

    const { data } = await query.limit(limit);
    faqs = ((data ?? []) as Pick<FaqRow, 'question' | 'answer'>[]).map((r) => ({
      question: r.question,
      answer: r.answer,
    }));
  }

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        <div className="mx-auto max-w-2xl divide-y divide-border">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
