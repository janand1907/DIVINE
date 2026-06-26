import * as LucideIcons from 'lucide-react';

interface Card {
  icon?: string;
  title: string;
  description: string;
  image?: string;
}

interface Props {
  config: Record<string, unknown>;
}

export function FeatureCards({ config }: Props) {
  const heading = (config.heading as string) || '';
  const subheading = (config.subheading as string) || '';
  const cards = (config.cards as Card[]) || [];
  const columns = (config.columns as number) || 3;

  if (cards.length === 0) return null;

  const colsClass =
    columns === 2 ? 'sm:grid-cols-2' :
    columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
    'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-2 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        {subheading && (
          <p className="mb-8 text-center text-muted-foreground">{subheading}</p>
        )}
        <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
          {cards.map((card, i) => {
            const IconComp = card.icon ? (LucideIcons as Record<string, unknown>)[card.icon] as React.ComponentType<{ className?: string }> : null;
            return (
              <div key={i} className="flex flex-col items-center rounded-lg border border-border bg-card p-6 text-center shadow-sm">
                {card.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.image} alt={card.title} className="mb-4 h-12 w-12 rounded-lg object-cover" />
                ) : IconComp ? (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <IconComp className="h-6 w-6 text-primary" />
                  </div>
                ) : null}
                <h3 className="font-heading text-base font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
