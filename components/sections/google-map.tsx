interface Props {
  config: Record<string, unknown>;
}

export function GoogleMap({ config }: Props) {
  const embedUrl = (config.embed_url as string) || '';
  const height = (config.height as number) || 400;
  const addressLabel = (config.address_label as string) || '';

  if (!embedUrl) return null;

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-brand">
        {addressLabel && (
          <p className="mb-4 text-center text-sm text-muted-foreground">{addressLabel}</p>
        )}
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
      </div>
    </section>
  );
}
