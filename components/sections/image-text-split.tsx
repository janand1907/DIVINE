interface Props {
  config: Record<string, unknown>;
}

export function ImageTextSplit({ config }: Props) {
  const heading = (config.heading as string) || '';
  const text = (config.text as string) || '';
  const image = (config.image as string) || '';
  const imageSide = (config.image_side as string) || 'right';
  const ctaText = (config.cta_text as string) || '';
  const ctaUrl = (config.cta_url as string) || '';

  const orderClass = imageSide === 'left' ? 'lg:order-last' : '';

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-brand grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className={orderClass}>
          {heading && (
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {heading}
            </h2>
          )}
          {text && (
            <div
              className="mt-4 text-muted-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
          {ctaText && ctaUrl && (
            <a
              href={ctaUrl}
              className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
            >
              {ctaText}
            </a>
          )}
        </div>
        {image && (
          <div className="overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={heading || 'Section image'} className="w-full object-cover" loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
}
