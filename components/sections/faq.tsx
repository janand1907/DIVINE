import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/types/database';

interface Props {
  config: Record<string, unknown>;
}

export function Faq({ config }: Props) {
  const heading = (config.heading as string) || 'Frequently Asked Questions';
  const faqs = (config.faqs as FaqItem[]) || [];

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
