interface Stat {
  value: string;
  label: string;
}

interface Props {
  config: Record<string, unknown>;
}

export function Statistics({ config }: Props) {
  const heading = (config.heading as string) || '';
  const stats = (config.stats as Stat[]) || [];
  const background = (config.background as string) || 'default';

  if (stats.length === 0) return null;

  const bgClass =
    background === 'muted' ? 'bg-muted/40' :
    background === 'dark' ? 'bg-brand-dark text-white' :
    background === 'primary' ? 'bg-primary/5' :
    'bg-background';

  return (
    <section className={`py-12 md:py-16 ${bgClass}`}>
      <div className="container-brand">
        {heading && (
          <h2 className={`mb-10 text-center font-heading text-2xl font-bold ${background === 'dark' ? 'text-white' : 'text-foreground'}`}>
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`font-heading text-3xl font-bold ${background === 'dark' ? 'text-white' : 'text-primary'}`}>
                {stat.value}
              </p>
              <p className={`mt-1 text-sm ${background === 'dark' ? 'text-white/70' : 'text-muted-foreground'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
