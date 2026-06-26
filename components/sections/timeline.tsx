interface TimelineItem {
  day?: number;
  title: string;
  description: string;
  image?: string;
}

interface Props {
  config: Record<string, unknown>;
}

export function Timeline({ config }: Props) {
  const heading = (config.heading as string) || '';
  const items = (config.items as TimelineItem[]) || [];

  if (items.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand">
        {heading && (
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground">{heading}</h2>
        )}
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
          {items.map((item, i) => (
            <div key={i} className="relative mb-8 flex items-start gap-6 md:gap-10">
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.day ?? i + 1}
              </div>
              <div className="flex-1 rounded-lg border border-border bg-card p-4 shadow-sm">
                <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title} className="mt-3 rounded-md object-cover" loading="lazy" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
