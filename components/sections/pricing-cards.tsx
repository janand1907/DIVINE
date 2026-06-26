import { Check } from 'lucide-react';

interface PricingCard {
  label: string;
  price: string;
  features: string[];
}

interface Props {
  config: Record<string, unknown>;
}

export function PricingCards({ config }: Props) {
  const heading = (config.heading as string) || '';
  const manualPricing = (config.manual_pricing as PricingCard[]) || [];

  if (manualPricing.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {manualPricing.map((card, i) => (
            <div key={i} className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-foreground">{card.label}</h3>
              <p className="mt-2 text-2xl font-bold text-primary">{card.price}</p>
              {card.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {card.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {feat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
