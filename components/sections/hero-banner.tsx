interface Props {
  config: Record<string, unknown>;
}

export function HeroBanner({ config }: Props) {
  const heading = (config.heading as string) || '';
  const subheading = (config.subheading as string) || '';
  const backgroundImage = (config.background_image as string) || '';
  const backgroundVideo = (config.background_video as string) || '';
  const overlayOpacity = (config.overlay_opacity as number) ?? 0.5;
  const ctaPrimaryText = (config.cta_primary_text as string) || '';
  const ctaPrimaryUrl = (config.cta_primary_url as string) || '';
  const ctaSecondaryText = (config.cta_secondary_text as string) || '';
  const ctaSecondaryUrl = (config.cta_secondary_url as string) || '';
  const height = (config.height as string) || 'large';
  const textAlign = (config.text_align as string) || 'center';

  const heightClass =
    height === 'full' ? 'min-h-screen' :
    height === 'large' ? 'min-h-[70vh]' :
    height === 'medium' ? 'min-h-[50vh]' :
    'min-h-[35vh]';

  const alignClass =
    textAlign === 'left' ? 'text-left items-start' :
    textAlign === 'right' ? 'text-right items-end' :
    'text-center items-center';

  return (
    <section className={`relative isolate flex ${heightClass} ${alignClass} justify-center overflow-hidden bg-brand-dark`}>
      {backgroundVideo ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={backgroundVideo}
        />
      ) : backgroundImage ? (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}
      <div
        className="absolute inset-0 -z-[5] bg-brand-dark"
        style={{ opacity: overlayOpacity }}
      />
      <div className={`container-brand relative z-10 flex flex-col ${alignClass} py-16 md:py-24`}>
        {heading && (
          <h1 className="max-w-4xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="mt-4 max-w-2xl text-lg text-white/85 text-balance">
            {subheading}
          </p>
        )}
        {(ctaPrimaryText || ctaSecondaryText) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctaPrimaryText && ctaPrimaryUrl && (
              <a
                href={ctaPrimaryUrl}
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                {ctaPrimaryText}
              </a>
            )}
            {ctaSecondaryText && ctaSecondaryUrl && (
              <a
                href={ctaSecondaryUrl}
                className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                {ctaSecondaryText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
