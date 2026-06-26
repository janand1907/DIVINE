interface Props {
  config: Record<string, unknown>;
}

export function HtmlBlock({ config }: Props) {
  const html = (config.html as string) || '';

  if (!html) return null;

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-brand">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
