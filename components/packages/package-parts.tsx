import { Check, X as XIcon } from 'lucide-react';
import type { PricingOption, FaqItem } from '@/types/database';

export function PricingTable({ pricing }: { pricing: PricingOption[] }) {
  if (pricing.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pricing.map((p, i) => (
        <div
          key={i}
          className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-brand"
        >
          <h4 className="font-heading text-lg font-semibold text-foreground">{p.label}</h4>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">{p.price}</p>
          <ul className="mt-4 flex-1 space-y-2">
            {p.inclusions.map((inc, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function InclusionList({ inclusions, exclusions }: { inclusions: string[]; exclusions: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Inclusions</h3>
        <ul className="mt-4 space-y-2">
          {inclusions.map((inc, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{inc}</span>
            </li>
          ))}
          {inclusions.length === 0 && <li className="text-sm text-muted-foreground">Not specified</li>}
        </ul>
      </div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Exclusions</h3>
        <ul className="mt-4 space-y-2">
          {exclusions.map((exc, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <XIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <span>{exc}</span>
            </li>
          ))}
          {exclusions.length === 0 && <li className="text-sm text-muted-foreground">Not specified</li>}
        </ul>
      </div>
    </div>
  );
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function PackageFaq({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left text-foreground">{f.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
