interface Props {
  config: Record<string, unknown>;
}

export function RichText({ config }: Props) {
  const content = (config.content as string) || '';
  const maxWidth = (config.max_width as string) || 'normal';
  const background = (config.background as string) || 'default';

  const widthClass =
    maxWidth === 'narrow' ? 'max-w-2xl' :
    maxWidth === 'wide' ? 'max-w-5xl' :
    'max-w-3xl';

  const bgClass =
    background === 'muted' ? 'bg-muted/40' :
    background === 'dark' ? 'bg-brand-dark text-white' :
    background === 'primary' ? 'bg-primary/5' :
    'bg-background';

  if (!content) return null;

  return (
    <section className={`py-12 md:py-16 ${bgClass}`}>
      <div className="container-brand">
        <div
          className={`mx-auto ${widthClass} prose prose-lg max-w-none text-muted-foreground [&_h2]:font-heading [&_h2]:text-foreground [&_h3]:font-heading [&_h3]:text-foreground [&_strong]:text-foreground`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
